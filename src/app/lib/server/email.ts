import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendPaidEmails(opts: {
  toCustomer: string;
  customerName: string;
  orderId: string;
  totalCents: number;
}) {
  const from = process.env.EMAIL_FROM!;
  const notify = process.env.EMAIL_NOTIFY;

  const subject = `Conferma ordine ${opts.orderId}`;
  const text = `Ciao ${opts.customerName},

Ordine confermato: ${opts.orderId}
Totale: € ${(opts.totalCents / 100).toFixed(2)}

Grazie!`;

  await resend.emails.send({ from, to: opts.toCustomer, subject, text });

  if (notify) {
    await resend.emails.send({
      from,
      to: notify,
      subject: `Nuovo ordine PAGATO ${opts.orderId}`,
      text: `Ordine pagato: ${opts.orderId}
Cliente: ${opts.toCustomer}
Totale: € ${(opts.totalCents / 100).toFixed(2)}`
    });
  }
}
