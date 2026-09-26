import { addDoc, collection } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

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
  if (isFirebaseConfigured) {
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
  }

  return dispatched;
}

export interface RequestConfirmationEmailParams {
  recipientEmail: string;
  recipientName: string;
  requestId: string;
  requestType: string;
  submittedAt?: string | Date;
  location?: string;
  trackUrl?: string;
}

/**
 * Dispatches an authentic Request Confirmation email to citizen's registered email
 * with a clean, professional JanSetu design matching the official portal.
 */
export async function sendRequestConfirmationEmail(params: RequestConfirmationEmailParams): Promise<boolean> {
  const {
    recipientEmail,
    recipientName = 'Citizen',
    requestId,
    requestType,
    submittedAt,
    trackUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/citizen/requests/${requestId}`,
  } = params;

  const dateObj = submittedAt ? new Date(submittedAt) : new Date();
  const formattedDate = dateObj.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const submittedOnStr = `${formattedDate}, ${formattedTime}`;

  const subject = `JanSetu: Request Submitted Successfully [${requestId}]`;

  const plainTextBody = `Hello ${recipientName},

We're happy to let you know that your request has been successfully submitted.

REQUEST SUMMARY:
* Request ID: ${requestId}
* Request Type: ${requestType}
* Submitted On: ${submittedOnStr}

Your request has been received and will be reviewed by the concerned department.
You will receive an email when there is an update on your request status.

Track your request status here:
${trackUrl}

If you have any questions, feel free to reach out to us.
Thank you for being a valued citizen!

Team JanSetu
Together for a better tomorrow`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Request Submitted Successfully</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #F3F8F5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1E293B;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 1.5px solid #D1E7DD; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); overflow: hidden;">
    
    <!-- Top Header Brand -->
    <tr>
      <td style="padding: 24px 28px 12px 28px; border-bottom: 1px solid #F0FDF4;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td width="36" valign="middle">
              <div style="width: 32px; height: 32px; background-color: #10B981; border-radius: 8px; text-align: center; line-height: 32px; font-size: 18px; color: #ffffff; font-weight: bold; display: inline-block;">
                🌱
              </div>
            </td>
            <td valign="middle" style="padding-left: 10px;">
              <div style="font-size: 19px; font-weight: 800; color: #064E3B; letter-spacing: -0.3px; line-height: 1.1;">JanSetu</div>
              <div style="font-size: 11px; font-weight: 500; color: #64748B; margin-top: 2px;">Connecting Citizens to a Better Tomorrow</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Illustration & Hero Section -->
    <tr>
      <td style="padding: 24px 28px 10px 28px; text-align: center;">
        
        <!-- Envelope Badge Icon -->
        <div style="display: inline-block; width: 84px; height: 84px; background-color: #E8F7F0; border-radius: 50%; text-align: center; line-height: 84px; margin: 0 auto 16px auto; position: relative;">
          <div style="font-size: 38px; line-height: 84px;">✉️</div>
        </div>

        <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 800; color: #0F172A; letter-spacing: -0.5px;">
          Your request has been submitted!
        </h1>
        <div style="display: inline-block; background-color: #DCFCE7; color: #15803D; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
          Request Submitted Successfully
        </div>

        <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #334155; text-align: left;">
          Hello <strong>${recipientName}</strong>,
        </p>
        <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569; text-align: left;">
          We're happy to let you know that your request has been successfully submitted. Our team will review it and get back to you soon with an update.
        </p>

        <!-- Information Box -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #EAF8F0; border: 1.5px solid #BBF7D0; border-radius: 16px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 18px 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 13px; color: #1E293B;">
                <tr>
                  <td width="30" style="padding: 6px 0; font-size: 16px; vertical-align: middle;">📄</td>
                  <td width="120" style="padding: 6px 0; font-weight: 700; color: #166534; vertical-align: middle;">Request ID</td>
                  <td width="15" style="padding: 6px 0; font-weight: 700; color: #166534; text-align: center; vertical-align: middle;">:</td>
                  <td style="padding: 6px 0; font-family: monospace, monospace; font-size: 14px; font-weight: 800; color: #0F172A; vertical-align: middle;">#${requestId}</td>
                </tr>
                <tr>
                  <td width="30" style="padding: 6px 0; font-size: 16px; vertical-align: middle;">🏷️</td>
                  <td width="120" style="padding: 6px 0; font-weight: 700; color: #166534; vertical-align: middle;">Request Type</td>
                  <td width="15" style="padding: 6px 0; font-weight: 700; color: #166534; text-align: center; vertical-align: middle;">:</td>
                  <td style="padding: 6px 0; font-weight: 700; color: #0F172A; vertical-align: middle;">${requestType}</td>
                </tr>
                <tr>
                  <td width="30" style="padding: 6px 0; font-size: 16px; vertical-align: middle;">📅</td>
                  <td width="120" style="padding: 6px 0; font-weight: 700; color: #166534; vertical-align: middle;">Submitted On</td>
                  <td width="15" style="padding: 6px 0; font-weight: 700; color: #166534; text-align: center; vertical-align: middle;">:</td>
                  <td style="padding: 6px 0; font-weight: 600; color: #334155; vertical-align: middle;">${submittedOnStr}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Track CTA Button -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
          <tr>
            <td align="center">
              <a href="${trackUrl}" target="_blank" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 13px 36px; border-radius: 9999px; font-weight: 700; font-size: 14px; letter-spacing: 0.2px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35); text-align: center;">
                Track My Request
              </a>
            </td>
          </tr>
        </table>

        <!-- Department Review & Updates Note -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; text-align: left;">
          <tr>
            <td style="padding: 12px 16px; background-color: #F8FAFC; border-radius: 12px; border-left: 4px solid #059669;">
              <p style="margin: 0 0 6px 0; font-size: 12px; line-height: 1.5; color: #334155;">
                ℹ️ <strong>Next Steps:</strong> Your request has been received and will be reviewed by the concerned department.
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748B;">
                🔔 The citizen will receive an email whenever there is a live progress update on this grievance.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin: 0 0 6px 0; font-size: 13px; line-height: 1.5; color: #475569; text-align: left;">
          If you have any questions, feel free to reach out to us.
        </p>
        <p style="margin: 0 0 20px 0; font-size: 13px; font-weight: 600; color: #1E293B; text-align: left;">
          Thank you for being a valued citizen!
        </p>

      </td>
    </tr>

    <!-- Footer Signature -->
    <tr>
      <td style="padding: 16px 28px 24px 28px; background-color: #F0FDF4; border-top: 1px solid #DCFCE7;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td valign="middle" style="text-align: left;">
              <div style="font-size: 13px; font-weight: 800; color: #065F46;">Team JanSetu</div>
              <div style="font-size: 11px; color: #64748B; margin-top: 2px;">Civic Governance Portal</div>
            </td>
            <td valign="middle" style="text-align: right;">
              <span style="font-size: 12px; font-style: italic; color: #059669; font-weight: 600;">Together for a better tomorrow</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

  </table>
</body>
</html>
  `;

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
        recipient_name: recipientName,
        request_id: requestId,
        request_type: requestType,
        submitted_on: submittedOnStr,
        track_url: trackUrl,
        message: plainTextBody,
      }),
    });
    if (res.ok) {
      dispatched = true;
    }
  } catch (err) {
    console.warn('Direct mail dispatch relay notice (confirmation):', err);
  }

  // 2. Also register in Firestore 'mail' collection for Firebase Trigger Email
  if (isFirebaseConfigured) {
    try {
      await addDoc(collection(db, 'mail'), {
        to: [recipientEmail],
        message: {
          subject: subject,
          text: plainTextBody,
          html: htmlBody,
        },
        metadata: {
          type: 'request_confirmation',
          requestId: requestId,
          recipientName: recipientName,
        },
        createdAt: new Date().toISOString(),
      });
      dispatched = true;
    } catch (err) {
      console.warn('Firestore mail trigger collection notice (confirmation):', err);
    }
  }

  return dispatched;
}
