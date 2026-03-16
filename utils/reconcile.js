/**
 * Cross-check Magento enrollments with Stripe by plan Id and installments paid.
 * stripePaymentsByPlan: Map(planId -> installmentsPaid count from Stripe).
 */
export function findMismatches(enrollments, stripePaymentsByPlan) {
  const mismatches = [];
  const isMap = stripePaymentsByPlan instanceof Map;

  for (let i = 0; i < enrollments.length; i++) {
    const e = enrollments[i];
    const planId = e.planId && e.planId.trim();
    if (!planId) {
      mismatches.push({ ...e, reason: 'missing_plan_id' });
      continue;
    }

    const stripeCount = isMap
      ? stripePaymentsByPlan.get(planId)
      : (stripePaymentsByPlan.has && stripePaymentsByPlan.has(planId)) ? 1 : undefined;
    const magentoCount = parseInt(String(e.installmentsPaid || '0').trim(), 10);

    if (stripeCount === undefined) {
      mismatches.push({ ...e, reason: 'plan_not_in_stripe', stripeInstallmentsPaid: null });
      continue;
    }
    if (magentoCount !== stripeCount) {
      mismatches.push({
        ...e,
        reason: 'installments_mismatch',
        magentoInstallmentsPaid: magentoCount,
        stripeInstallmentsPaid: stripeCount
      });
    }
  }

  return mismatches;
}
