import { formatEgp } from "@/lib/payments";
import type { InvoiceRecord, PaymentRecord } from "@/types/billing";

export function BillingHistory({
  invoices,
  payments,
}: {
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
}) {
  return (
    <div className="rounded-lg border border-border bg-background">
      <div className="border-b border-border p-4">
        <h3 className="font-semibold">Billing history</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Invoices and Paymob payment records.
        </p>
      </div>
      <div className="divide-y divide-border">
        {invoices.map((invoice) => (
          <div
            className="flex items-center justify-between gap-4 p-4 text-sm"
            key={invoice.id}
          >
            <div>
              <p className="font-medium">{invoice.planId} invoice</p>
              <p className="text-xs text-muted-foreground">{invoice.status}</p>
            </div>
            <p>{formatEgp(invoice.amountCents)}</p>
          </div>
        ))}
        {payments.map((payment) => (
          <div
            className="flex items-center justify-between gap-4 p-4 text-sm"
            key={payment.id}
          >
            <div>
              <p className="font-medium">Paymob payment</p>
              <p className="text-xs text-muted-foreground">{payment.status}</p>
            </div>
            <p>{formatEgp(payment.amountCents)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
