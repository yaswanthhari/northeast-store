import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('No user found to link order');
      return;
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: 100,
        status: 'PENDING',
        shippingAddress: '123 Test St',
        city: 'Test City',
        postalCode: '123456',
        items: {
          create: [
            {
              productId: 'test-id', // This might fail if product doesn't exist
              quantity: 1,
              price: 100,
            }
          ]
        }
      }
    });
    console.log('Order created successfully:', order.id);
  } catch (err) {
    console.error('Error creating order:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
