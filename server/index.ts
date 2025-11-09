import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// 👉 Fix für __dirname (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('[ENV-Check] Host:', process.env['SMTP_HOST'], 'Port:', process.env['SMTP_PORT'], 'Secure:', process.env['SMTP_SECURE']);
console.log('[ENV-Check] User gesetzt?', !!process.env['SMTP_USER'], 'Pass gesetzt?', !!process.env['SMTP_PASS']);


import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const app = express();

// Sicherheit + Limits
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60_000, max: 20 })); // max 20 req/min

// In DEV via Proxy, in PROD ggf. konkrete Origins erlauben
app.use(cors());

// Validierung des Request-Bodys
const MailSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

type OrderItem = { id: string; name: string; qty: number; price: number };
type OrderPayload = {
  customer: {
    firstName: string; lastName: string; email: string;
    address?: string; zip?: string; city?: string; payment?: string;
  };
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; total: number };
};



// Nodemailer Transporter für Strato
/*const transporter = nodemailer.createTransport({
  host: process.env['SMTP_HOST'],
  port: Number(process.env['SMTP_PORT']),
  secure: process.env['SMTP_SECURE'] === 'true',
  auth: {
    user: process.env['SMTP_USER'],
    pass: process.env['SMTP_PASS'],
  },
});*/
const transporter = nodemailer.createTransport(
  {
    host: process.env['SMTP_HOST'],            // z.B. smtp.strato.de
    port: Number(process.env['SMTP_PORT']),    // 465 ODER 587 (siehe unten)
    secure: process.env['SMTP_SECURE'] === 'true', // true bei 465, false bei 587
    auth: {
      user: process.env['SMTP_USER'],          // volle Adresse, z.B. info@deinedomain.de
      pass: process.env['SMTP_PASS'],
    },
    requireTLS: process.env['SMTP_SECURE'] !== 'true', // bei 587 erzwingen
    tls: {
      minVersion: 'TLSv1.2',
      // NUR zum Eingrenzen bei Zertifikat-Fehlern aktivieren (später wieder entfernen!):
      // rejectUnauthorized: false,
    },
    logger: true,
    debug: true,
  },
  {
    from: process.env['SMTP_USER'] // Default-From
  }
);

function renderOrderHtml(o: OrderPayload) {
  const rows = o.items.map(i =>
    `<tr>
      <td style="padding:8px 0;">${i.name} ×${i.qty}</td>
      <td style="text-align:right;padding:8px 0;">${(i.price * i.qty).toFixed(2)} €</td>
    </tr>`
  ).join('');
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222">
    <h2 style="margin:0 0 12px">Bestellbestätigung</h2>
    <p>Hallo ${o.customer.firstName} ${o.customer.lastName},</p>
    <p>vielen Dank für deine Bestellung bei DesertStore. Hier ist deine Übersicht:</p>
    <table style="width:100%;border-collapse:collapse">
      <tbody>
        ${rows}
        <tr><td style="padding-top:10px;border-top:1px solid #eee">Zwischensumme</td>
            <td style="text-align:right;padding-top:10px;border-top:1px solid #eee">${o.totals.subtotal.toFixed(2)} €</td></tr>
        <tr><td>Versand</td><td style="text-align:right">${o.totals.shipping.toFixed(2)} €</td></tr>
        <tr><td><b>Total</b></td><td style="text-align:right"><b>${o.totals.total.toFixed(2)} €</b></td></tr>
      </tbody>
    </table>
    <p style="margin-top:16px">
      Lieferadresse:<br>
      ${o.customer.firstName} ${o.customer.lastName}<br>
      ${o.customer.address || ''}<br>
      ${o.customer.zip || ''} ${o.customer.city || ''}
    </p>
    <p>Zahlungsart: ${o.customer.payment || '-'}</p>
    <p style="color:#666">Dies ist eine automatische E-Mail. Bei Fragen antworte einfach auf diese Nachricht.</p>
  </div>`;
}



// 🧩 Schritt 1: Verbindung zu Strato beim Start prüfen
transporter.verify((err, success) => {
  if (err) {
    console.error('❌ verify() Fehler:', err);
  } else {
    console.log('✅ SMTP ok:', success);
  }
});

// NUR ZUM TESTEN – danach wieder entfernen/auskommentieren
// transporter.sendMail({
//   from: process.env['SMTP_USER'],        // wichtig: identisch zum Login-Postfach
//   to: process.env['MAIL_TO'],            // wohin die Nachricht gehen soll
//   subject: '✅ SMTP Test (Webshop)',
//   text: 'Hallo! Diese Testmail kam über Strato SMTP.',
//   replyTo: 'noreply@' + (process.env['SMTP_USER']?.split('@')[1] ?? 'example.com')
// }).then(info => {
//   console.log('📩 Testmail gesendet. Message-ID:', info.messageId);
// }).catch(err => {
//   console.error('❌ sendMail-Fehler:', err);
// });



app.post('/api/mail', async (req, res) => {
  const { name, email, message } = req.body ?? {};
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'name, email, message erforderlich' });
  }

  try {
    const info = await transporter.sendMail({
      from: process.env['SMTP_USER'],      // muss beim Strato-Login-Postfach bleiben
      to: process.env['MAIL_TO'],          // z.B. dein internes Zielpostfach
      subject: `Neue Nachricht von ${name}`,
      text: `Von: ${name} <${email}>\n\n${message}`,
      html: `<p><b>Von:</b> ${name} &lt;${email}&gt;</p><pre style="white-space:pre-wrap">${message}</pre>`,
      replyTo: `${name} <${email}>`
    });

    res.json({ ok: true, id: info.messageId });
  } catch (err) {
    console.error('Mail send error:', err);
    res.status(500).json({ ok: false, error: 'Versand fehlgeschlagen' });
  }
});

app.post('/api/mail/send-order-confirmation', async (req, res) => {
  const order = req.body as OrderPayload;
  if (!order?.customer?.email || !order?.items?.length) {
    return res.status(400).json({ error: 'invalid-payload' });
  }

  const subject = `Deine Bestellung bei DesertStore (#${Date.now().toString().slice(-6)})`;
  const html = renderOrderHtml(order);

  try {
    // an den Kunden
    await transporter.sendMail({
      from: process.env['SHOP_FROM'],
      to: order.customer.email,
      bcc: process.env['SHOP_BCC'], // Shop-Kopie
      subject,
      html,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('sendMail failed:', err);
    res.status(500).json({ error: 'send-failed' });
  }
});


const PORT = Number(process.env['PORT'] ?? 3000);
app.listen(PORT, () => console.log(`API läuft auf :${PORT}`));
