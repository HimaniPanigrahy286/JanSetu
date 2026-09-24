import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Dispatches an authentic OTP verification email to the user's email address.
 */
export async function sendOtpEmail(recipientEmail: string, recipientName: string, otpCode: string): Promise<boolean> {
  const subject = `Your JanSetu Verification Code: ${otpCode}`;
  const messageBody = `Hello ${recipientName || 'User'},\n\nYour 6-digit verification OTP code for JanSetu Platform is: ${otpCode}\n\nPlease enter this code manually on the website to verify your email address and activate your account.\n\nThis code is valid for 10 minutes. If you did not request this registration, please ignore this email.\n\nRegards,\nJanSetu Civic Governance Platform`;

  let dispatched = false;

  // 1. Dispatch via formsubmit direct email relay API
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'box',
        _captcha: 'false',
        sender_name: 'JanSetu Platform',
        recipient_name: recipientName || 'JanSetu User',
        verification_code: otpCode,
        message: messageBody,
      }),
    });
    if (res.ok) {
      dispatched = true;
    }
  } catch (err) {
    console.warn('Direct mail dispatch relay notice:', err);
  }

  // 2. Also register in Firestore 'mail' collection in case Firebase Trigger Email extension is configured
  try {
    await addDoc(collection(db, 'mail'), {
      to: [recipientEmail],
      message: {
        subject: subject,
        text: messageBody,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 24px; border: 2px solid #000; border-radius: 12px; background: #ffffff;">
            <div style="background: #FFE500; padding: 10px 16px; border-radius: 6px; font-weight: 800; font-size: 16px; border: 2px solid #000; display: inline-block; margin-bottom: 12px;">
              JANSETU PLATFORM
            </div>
            <h2 style="margin-top: 8px; color: #000;">Email Verification Code</h2>
            <p style="font-size: 14px; color: #333;">Hello <strong>${recipientName || 'User'}</strong>,</p>
            <p style="font-size: 14px; color: #333;">Please use the following 6-digit verification code to complete your JanSetu registration:</p>
            <div style="font-size: 32px; font-weight: 900; font-family: monospace; letter-spacing: 6px; padding: 14px 20px; background: #FFE500; border: 2px solid #000; border-radius: 8px; text-align: center; margin: 18px 0; color: #000;">
              ${otpCode}
            </div>
            <p style="font-size: 12px; color: #666; margin-top: 16px;">
              Enter this code manually on the website. This code expires in 10 minutes.
            </p>
          </div>
        `,
      },
      createdAt: new Date().toISOString(),
    });
    dispatched = true;
  } catch (err) {
    console.warn('Firestore mail trigger collection notice:', err);
  }

  return dispatched;
}
