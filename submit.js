const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, phone, pestIssue, address, smsConsent } = req.body;

  // Basic validation
  if (!firstName || !lastName || !phone || !pestIssue || !address) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }

  const fullName = `${firstName} ${lastName}`;
  const submittedAt = new Date().toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const smsLabel = smsConsent ? '✅ Yes — consented to SMS' : '❌ No — did not consent';

  try {
    await resend.emails.send({
      from: 'leads@thefamilypestcontrol.com',
      to: 'mailboxforben@gmail.com',
      replyTo: 'myfamilypestcontrol@gmail.com',
      subject: `🏠 New Lead: ${fullName} — ${pestIssue}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>New Lead</title>
</head>
<body style="margin:0;padding:0;background:#f0ead9;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ead9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#faf7f2;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(26,22,18,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:#2e5c30;padding:0;">
              <div style="height:4px;background:linear-gradient(90deg,#2e5c30,#5a9e5c);"></div>
            </td>
          </tr>
          <tr>
            <td style="background:#2e5c30;padding:28px 36px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:0.7rem;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:6px;">The Family Pest Control</div>
                    <div style="font-family:Georgia,serif;font-size:1.6rem;color:#ffffff;font-weight:700;line-height:1.2;">New Lead Submission</div>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <div style="background:rgba(255,255,255,0.15);border-radius:8px;padding:10px 16px;text-align:center;">
                      <div style="font-size:1.8rem;line-height:1;">🏡</div>
                      <div style="font-size:0.7rem;color:rgba(255,255,255,0.7);margin-top:4px;letter-spacing:1px;">LEAD</div>
                    </div>
                  </td>
                </tr>
              </table>
              <div style="margin-top:16px;display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.2);border-radius:100px;padding:6px 14px;">
                <span style="font-size:0.78rem;color:rgba(255,255,255,0.85);">📅 ${submittedAt} CT</span>
              </div>
            </td>
          </tr>

          <!-- Pest Issue highlight -->
          <tr>
            <td style="background:#b84a25;padding:14px 36px;">
              <span style="font-size:0.72rem;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">Pest Issue Reported</span>
              <div style="font-family:Georgia,serif;font-size:1.2rem;color:#ffffff;font-weight:700;margin-top:4px;">🐛 ${pestIssue}</div>
            </td>
          </tr>

          <!-- Lead Details -->
          <tr>
            <td style="padding:32px 36px 0;">
              <div style="font-size:0.72rem;letter-spacing:3px;text-transform:uppercase;color:#7a7168;margin-bottom:20px;">Contact Information</div>

              <!-- Name -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background:#f0ead9;border-radius:8px;padding:16px 20px;border-left:4px solid #2e5c30;">
                    <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1.5px;color:#7a7168;margin-bottom:4px;">Full Name</div>
                    <div style="font-size:1.15rem;font-weight:700;color:#1a1612;">${fullName}</div>
                  </td>
                </tr>
              </table>

              <!-- Phone -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background:#f0ead9;border-radius:8px;padding:16px 20px;border-left:4px solid #2e5c30;">
                    <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1.5px;color:#7a7168;margin-bottom:4px;">Phone</div>
                    <div style="font-size:1.15rem;font-weight:700;color:#1a1612;">📞 <a href="tel:${phone.replace(/\D/g,'')}" style="color:#2e5c30;text-decoration:none;">${phone}</a></div>
                  </td>
                </tr>
              </table>

              <!-- Address -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="background:#f0ead9;border-radius:8px;padding:16px 20px;border-left:4px solid #2e5c30;">
                    <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1.5px;color:#7a7168;margin-bottom:4px;">Service Address</div>
                    <div style="font-size:1.05rem;font-weight:700;color:#1a1612;">📍 ${address}</div>
                  </td>
                </tr>
              </table>

              <!-- SMS Consent -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#f0ead9;border-radius:8px;padding:16px 20px;border-left:4px solid ${smsConsent ? '#2e5c30' : '#b84a25'};">
                    <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1.5px;color:#7a7168;margin-bottom:4px;">SMS Consent</div>
                    <div style="font-size:1rem;font-weight:700;color:#1a1612;">${smsLabel}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td style="padding:0 36px 36px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#2e5c30;border-radius:8px;">
                    <a href="tel:${phone.replace(/\D/g,'')}" style="display:inline-block;padding:14px 28px;font-size:0.95rem;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.3px;">📞 Call ${phone} Now</a>
                  </td>
                  <td width="12"></td>
                  <td style="background:#faf7f2;border:2px solid #e2d5bc;border-radius:8px;">
                    <a href="sms:${phone.replace(/\D/g,'')}" style="display:inline-block;padding:14px 28px;font-size:0.95rem;font-weight:700;color:#1a1612;text-decoration:none;letter-spacing:0.3px;">💬 Send a Text</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a1612;padding:20px 36px;border-radius:0 0 10px 10px;">
              <p style="font-size:0.78rem;color:rgba(250,247,242,0.35);margin:0;">This lead was submitted via thefamilypestcontrol.com · The Family Pest Control · Gladstone, MO</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Failed to send email. Please call us directly at 816-429-0380.' });
  }
};
