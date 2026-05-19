import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendOrderConfirmation } from '@/lib/mail';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface OrderRequestItem {
  id: string;
  name?: string;
  price: number;
  quantity: number;
}

interface ShippingDetails {
  address: string;
  city: string;
  postalCode: string;
}

interface CreateOrderRequest {
  items?: OrderRequestItem[];
  total: number;
  shippingDetails: ShippingDetails;
}

type DraftOrderData = Omit<Prisma.OrderUncheckedCreateInput, 'userId'> & {
  userId?: string;
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Internal Server Error';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    const { items, total, shippingDetails } = (await request.json()) as CreateOrderRequest;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Verify all products exist
    const productIds = items.map((item: OrderRequestItem) => item.id);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (existingProducts.length !== items.length) {
      const existingIds = existingProducts.map(p => p.id);
      const missingIds = productIds.filter((id: string) => !existingIds.includes(id));
      return NextResponse.json({ 
        error: `Some products in your cart are no longer available. Please clear your cart and add them again.`,
        missingIds 
      }, { status: 400 });
    }

    // 1. Create the Order
    const orderData: DraftOrderData = {
      total: total,
      status: 'PENDING',
      shippingAddress: shippingDetails.address,
      city: shippingDetails.city,
      postalCode: shippingDetails.postalCode,
      items: {
        create: items.map((item: OrderRequestItem) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    // According to schema, Order.userId is NOT optional. 
    // We MUST have a user.
    if (!session || !session.id) {
      return NextResponse.json({ error: 'Please login to place an order' }, { status: 401 });
    }
    
    // Verify user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: session.id as string }
    });

    if (!user) {
      return NextResponse.json({ error: 'Session invalid. Please logout and login again.' }, { status: 401 });
    }

    orderData.userId = user.id;

    const order = await prisma.order.create({
      data: orderData as Prisma.OrderUncheckedCreateInput,
      include: {
        items: {
          include: {
            product: true
          }
        },
      },
    });

    // Send email confirmation
    let emailSent = false;
    const recipientEmail = user.email;
    const recipientName = user.name || 'Valued Customer';
    
    try {
      console.log(`Sending order confirmation to registered user: ${recipientEmail} (${recipientName})`);
      await sendOrderConfirmation(order, recipientEmail, recipientName);
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }
    
    return NextResponse.json({ 
      message: 'Order placed successfully', 
      orderId: order.id,
      emailStatus: emailSent ? 'Sent' : 'Failed'
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

// ✅ Fix — add session check at the top of GET()
export async function GET(request: Request) {
  // Trigger fresh Vercel production rebuild with synchronized database schema
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === 'true';
    const isAdmin = session.role === 'ADMIN';

    const orders = await prisma.order.findMany({
      where: (isAdmin && all) ? {} : { userId: session.id as string }, // users only see their own, admins only see all if explicitly requested
      include: {
        user: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
  console.error('[FETCH ORDERS ERROR]', error);

  return NextResponse.json(
    { error: 'Failed to fetch orders' },
    { status: 500 }
  );
}
}
