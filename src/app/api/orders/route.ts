import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendOrderConfirmation } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    const { items, total, shippingDetails } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Verify all products exist
    const productIds = items.map((item: any) => item.id);
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
    const orderData: any = {
      total: total,
      status: 'PENDING',
      shippingAddress: shippingDetails.address,
      city: shippingDetails.city,
      postalCode: shippingDetails.postalCode,
      items: {
        create: items.map((item: any) => ({
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
      data: orderData,
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

  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
