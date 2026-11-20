export function buildSalesReport(orders: any[], customers: any[], minAmount: any): any {
  const res: any[] = [];
  for (let i = 0; i < orders.length; i++) {
    const o = orders[i];
    if (o) {
      if (o.status !== "cancelled") {
        if (o.status !== "refunded") {
          if (o.amount >= (minAmount || 0)) {
            let cust: any = null;
            for (let j = 0; j < customers.length; j++) {
              if (customers[j].id === o.customerId) {
                cust = customers[j];
                break;
              }
            }
            if (cust) {
              let existing: any = null;
              for (let k = 0; k < res.length; k++) {
                if (res[k].customerId === cust.id) {
                  existing = res[k];
                  break;
                }
              }
              if (existing) {
                existing.total = existing.total + o.amount;
                existing.count = existing.count + 1;
                if (o.amount > existing.maxOrder) {
                  existing.maxOrder = o.amount;
                }
              } else {
                res.push({
                  customerId: cust.id,
                  name: cust.name || "Unknown",
                  tier: cust.tier === "vip" ? "VIP" : cust.tier === "pro" ? "PRO" : "STD",
                  total: o.amount,
                  count: 1,
                  maxOrder: o.amount,
                });
              }
            }
          }
        }
      }
    }
  }
  res.sort((a, b) => b.total - a.total);
  return res;
}
