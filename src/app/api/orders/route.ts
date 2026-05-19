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
  items: OrderRequestItem[];
  total: number;
  shippingDetails: ShippingDetails;
}

interface FeedbackRequest {
  action: 'feedback';
  orderId: string;
  type: 'seller' | 'delivery';
  rating: number;
  comments: string;
}

interface ReviewRequest {
  action: 'review';
  productId: string;
  orderId: string;
  rating: number;
  comments: string;
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Internal Server Error';

type Session = Awaited<ReturnType<typeof getSession>>;

const getSessionId = (session: Session): string | null =>
  session && typeof session.id === 'string' ? session.id : null;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isOrderRequestItem = (value: unknown): value is OrderRequestItem =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  typeof value.price === 'number' &&
  typeof value.quantity === 'number';

const isCreateOrderRequest = (value: unknown): value is CreateOrderRequest =>
  isRecord(value) &&
  Array.isArray(value.items) &&
  value.items.every(isOrderRequestItem) &&
  typeof value.total === 'number' &&
  isRecord(value.shippingDetails) &&
  typeof value.shippingDetails.address === 'string' &&
  typeof value.shippingDetails.city === 'string' &&
  typeof value.shippingDetails.postalCode === 'string';

const isFeedbackRequest = (value: unknown): value is FeedbackRequest =>
  isRecord(value) &&
  value.action === 'feedback' &&
  typeof value.orderId === 'string' &&
  (value.type === 'seller' || value.type === 'delivery') &&
  typeof value.rating === 'number' &&
  typeof value.comments === 'string';

const isReviewRequest = (value: unknown): value is ReviewRequest =>
  isRecord(value) &&
  value.action === 'review' &&
  typeof value.productId === 'string' &&
  typeof value.orderId === 'string' &&
  typeof value.rating === 'number' &&
  typeof value.comments === 'string';

// ─────────────────────────────────────────────
// POST /api/orders — Create a new order
// ─────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const session = await getSession();

    const body: unknown = await request.json();

    // Route to sub-handlers based on action field
    if (isFeedbackRequest(body)) {
      return handleFeedback(body, session);
    }

    if (isReviewRequest(body)) {
      return handleReview(body, session);
    }

    if (!isCreateOrderRequest(body)) {
      return NextResponse.json({ error: 'Invalid order request' }, { status: 400 });
    }

    const { items, total, shippingDetails } = body;
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const sessionId = getSessionId(session);
    if (!sessionId) {
      return NextResponse.json({ error: 'Please login to place an order' }, { status: 401 });
    }

    // Verify all products exist
    const productIds = items.map((item: OrderRequestItem) => item.id);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (existingProducts.length !== items.length) {
      const existingIds = existingProducts.map((p) => p.id);
      const missingIds = productIds.filter((id: string) => !existingIds.includes(id));
      return NextResponse.json(
        {
          error: 'Some products in your cart are no longer available. Please clear your cart and add them again.',
          missingIds,
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: sessionId } });
    if (!user) {
      return NextResponse.json({ error: 'Session invalid. Please logout and login again.' }, { status: 401 });
    }

    const orderData: Prisma.OrderUncheckedCreateInput = {
      total,
      status: 'PENDING',
      shippingAddress: shippingDetails.address,
      city: shippingDetails.city,
      postalCode: shippingDetails.postalCode,
      userId: user.id,
      items: {
        create: items.map((item: OrderRequestItem) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    const order = await prisma.order.create({
      data: orderData,
      include: { items: { include: { product: true } } },
    });

    let emailSent = false;
    try {
      await sendOrderConfirmation(order, user.email, user.name || 'Valued Customer');
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    return NextResponse.json(
      { message: 'Order placed successfully', orderId: order.id, emailStatus: emailSent ? 'Sent' : 'Failed' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// GET /api/orders — Fetch orders (user or admin)
// ─────────────────────────────────────────────
export async function GET() {
  const session = await getSession();
  const sessionId = getSessionId(session);
  if (!sessionId || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const isAdmin = session.role === 'ADMIN';
    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: sessionId },
      include: {
        user: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('[FETCH ORDERS ERROR]', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// PATCH /api/orders — Cancel an order
// ─────────────────────────────────────────────
export async function PATCH(request: Request) {
  const session = await getSession();
  const sessionId = getSessionId(session);
  if (!sessionId || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderId } = (await request.json()) as { orderId: string };

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Only the owner or an admin can cancel
    const isAdmin = session.role === 'ADMIN';
    if (!isAdmin && order.userId !== sessionId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (order.status === 'CANCELLED') {
      return NextResponse.json({ error: 'Order is already cancelled' }, { status: 400 });
    }

    if (order.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Completed orders cannot be cancelled' }, { status: 400 });
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({ message: 'Order cancelled successfully', order: updated }, { status: 200 });
  } catch (error) {
    console.error('[CANCEL ORDER ERROR]', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// DELETE /api/orders — Admin-only hard delete
// ─────────────────────────────────────────────
export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
  }

  try {
    const { orderId } = (await request.json()) as { orderId: string };

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Delete order items first (if not using cascade in schema)
    await prisma.orderItem.deleteMany({ where: { orderId } });
    await prisma.order.delete({ where: { id: orderId } });

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('[DELETE ORDER ERROR]', error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 });
  }
}

// ─────────────────────────────────────────────
// INTERNAL: Feedback handler (seller / delivery)
// Called via POST with { action: 'feedback', ... }
// ─────────────────────────────────────────────
async function handleFeedback(body: FeedbackRequest, session: Awaited<ReturnType<typeof getSession>>) {
  const sessionId = getSessionId(session);
  if (!sessionId || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { orderId, type, rating, comments } = body;

  if (!orderId || !type || !rating || !comments) {
    return NextResponse.json({ error: 'orderId, type, rating, and comments are required' }, { status: 400 });
  }

  if (!['seller', 'delivery'].includes(type)) {
    return NextResponse.json({ error: 'type must be "seller" or "delivery"' }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }

  // Confirm order belongs to user
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  if (order.userId !== sessionId && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Save feedback — assumes an OrderFeedback model exists in your Prisma schema.
  // If it doesn't exist yet, add this to schema.prisma:
  //
  // model OrderFeedback {
  //   id        String   @id @default(cuid())
  //   orderId   String
  //   userId    String
  //   type      String   // "seller" | "delivery"
  //   rating    Int
  //   comments  String
  //   createdAt DateTime @default(now())
  //   order     Order    @relation(fields: [orderId], references: [id])
  //   user      User     @relation(fields: [userId], references: [id])
  // }
  //
  // Then run: npx prisma migrate dev --name add_order_feedback

  return NextResponse.json({ error: 'Feedback persistence is not available yet' }, { status: 501 });
}

// ─────────────────────────────────────────────
// INTERNAL: Product review handler
// Called via POST with { action: 'review', ... }
// ─────────────────────────────────────────────
async function handleReview(body: ReviewRequest, session: Awaited<ReturnType<typeof getSession>>) {
  const sessionId = getSessionId(session);
  if (!sessionId || !session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { productId, orderId, rating, comments } = body;

  if (!productId || !orderId || !rating || !comments) {
    return NextResponse.json({ error: 'productId, orderId, rating, and comments are required' }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }

  // Confirm this user actually ordered this product
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { id: orderId, userId: sessionId },
    },
  });

  if (!orderItem) {
    return NextResponse.json({ error: 'You can only review products you have ordered' }, { status: 403 });
  }

  return NextResponse.json({ error: 'Review persistence is not available yet' }, { status: 501 });
}
