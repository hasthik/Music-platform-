import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface FormData {
  plan: string;
  amount: string;
  name: string;
  email: string;
  phone: string;
  occasion: string;
  recipient: string;
  story: string;
  favsong: string;
  language: string;
  tone: string;
  delivery: string;
}

export async function POST(req: NextRequest) {
  let body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    formData: FormData;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, formData } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
  }

  // Verify HMAC signature — confirms the payment came from Razorpay and wasn't tampered with
  const message = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(message)
    .digest('hex');

  if (expectedSig !== razorpay_signature) {
    console.warn('Payment signature mismatch for order:', razorpay_order_id);
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
  }

  // Signature verified — submit order details to Formspree
  try {
    const resp = await fetch(process.env.FORMSPREE_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        '🎵 Plan': formData.plan,
        '💰 Amount': formData.amount,
        '💳 Payment ID': razorpay_payment_id,
        '🧾 Order ID': razorpay_order_id,
        '👤 Name': formData.name,
        '📧 Email': formData.email,
        '📱 Phone': formData.phone,
        '🎉 Occasion': formData.occasion,
        '🎁 For': formData.recipient,
        '🎵 Favourite Song': formData.favsong,
        '🌐 Language': formData.language,
        '🎼 Tone': formData.tone,
        '⏱ Delivery': formData.delivery,
        '📝 Story': formData.story,
      }),
    });

    if (!resp.ok) {
      console.error('Formspree submission failed:', await resp.text());
    }
  } catch (err) {
    // Log but do not fail — payment is already verified
    console.error('Formspree error:', err);
  }

  return NextResponse.json({ success: true });
}
