// utils/stripeApi.js

/**
 * Returns number of paid installments for a Stripe subscription.
 * Counts invoices where status === "paid", amount_paid > 0, and charge !== null.
 * Uses Stripe API (NO CAPTCHA, NO UI automation).
 * @param {string} subscriptionId - Stripe subscription id (e.g. sub_xxx), from Magento enrollment.
 * @returns {Promise<number>} Stripe count (paid, amount_paid > 0, has charge).
 */
export async function getStripeInstallments(subscriptionId) {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('❌ STRIPE_SECRET_KEY is not defined in .env file');
  }
  const subId = (subscriptionId && String(subscriptionId).trim()) || '';
  if (!subId) {
    throw new Error('getStripeInstallments requires a non-empty subscription ID');
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const url = new URL('https://api.stripe.com/v1/invoices');
  url.searchParams.set('subscription', subId);
  url.searchParams.set('status', 'paid');
  url.searchParams.set('limit', '100');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`❌ Stripe API Error: ${errorText}`);
  }

  const data = await response.json();
  const invoices = Array.isArray(data.data) ? data.data : [];
  const realPayments = invoices.filter(
    (inv) =>
      inv.status === 'paid' &&
      (inv.amount_paid ?? 0) > 0 &&
      inv.charge != null
  );
  return realPayments.length;
}