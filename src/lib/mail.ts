export async function sendOrderConfirmation(order: any, userEmail: string) {
  const emailContent = `
==================================================
ORDER CONFIRMATION - ${new Date().toLocaleString()}
==================================================
To: ${userEmail}
Subject: Order Placed Successfully! (Order ID: ${order.id})

Dear Customer,

Thank you for your purchase from The NorthEast Store!
We are preparing your treasures from the Eight States.

Order Details:
- Order ID: ${order.id}
- Total Amount: ₹${order.total.toFixed(2)}
- Status: ${order.status}

Shipping Address:
${order.shippingAddress}
${order.city} - ${order.postalCode}

Items:
${order.items.map((item: any) => `- Product ID: ${item.productId}, Qty: ${item.quantity}, Price: ₹${item.price}`).join('\n')}

We will notify you once your order is shipped.

Happy Shopping!
The NorthEast Store Team
==================================================
\n`;

  // In a real app, you would use Nodemailer or Resend here.
  // For now, we simulate by logging to the console.
  console.log(`[Email Simulation] Order confirmation sent to ${userEmail}`);
  console.log(emailContent);
}
