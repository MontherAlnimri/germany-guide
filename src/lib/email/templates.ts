export function welcomeEmail(name: string): { subject: string; html: string } {
  const displayName = name || "there";
  return {
    subject: "Welcome to Germany Guide!",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
<div style="background:#fff;border-radius:16px;padding:40px 32px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
  <div style="font-size:48px;margin-bottom:16px">&#x1F1E9;&#x1F1EA;</div>
  <h1 style="color:#111827;font-size:24px;margin:0 0 8px">Welcome, ${displayName}!</h1>
  <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px">
    Your Germany Guide account is set up and your first guide has been started automatically.
  </p>
  <div style="background:#eff6ff;border-radius:12px;padding:20px;margin-bottom:24px;text-align:left">
    <p style="color:#1e40af;font-size:14px;font-weight:600;margin:0 0 12px">Here is what you can do:</p>
    <ul style="color:#374151;font-size:14px;line-height:2;margin:0;padding-left:20px">
      <li>Follow step-by-step visa guides</li>
      <li>Track your important documents</li>
      <li>Set deadline reminders</li>
      <li>Export progress as PDF</li>
    </ul>
  </div>
  <a href="https://germany-guide-1.vercel.app/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 32px;border-radius:10px;font-weight:600;font-size:15px">
    Go to Dashboard
  </a>
</div>
<p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:24px">
  Germany Guide - Navigate German bureaucracy with confidence
</p>
</div>
</body>
</html>`,
  };
}

export function deadlineReminderEmail(
  name: string,
  deadlineTitle: string,
  dueDate: string,
  daysLeft: number
): { subject: string; html: string } {
  const displayName = name || "there";
  const urgencyColor = daysLeft <= 0 ? "#dc2626" : daysLeft <= 3 ? "#d97706" : "#2563eb";
  const urgencyBg = daysLeft <= 0 ? "#fef2f2" : daysLeft <= 3 ? "#fffbeb" : "#eff6ff";
  const urgencyText =
    daysLeft < 0
      ? `OVERDUE by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""}`
      : daysLeft === 0
        ? "Due TODAY"
        : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`;

  return {
    subject: daysLeft <= 0
      ? `OVERDUE: ${deadlineTitle}`
      : daysLeft === 0
        ? `Due Today: ${deadlineTitle}`
        : `Reminder: ${deadlineTitle} - ${daysLeft} days left`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
<div style="background:#fff;border-radius:16px;padding:40px 32px;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
  <div style="font-size:48px;text-align:center;margin-bottom:16px">&#x23F0;</div>
  <h1 style="color:#111827;font-size:22px;margin:0 0 8px;text-align:center">Deadline Reminder</h1>
  <p style="color:#6b7280;font-size:15px;text-align:center;margin:0 0 24px">Hi ${displayName},</p>
  <div style="background:${urgencyBg};border-radius:12px;padding:20px;margin-bottom:24px;text-align:center">
    <p style="color:${urgencyColor};font-size:20px;font-weight:700;margin:0 0 4px">${urgencyText}</p>
    <p style="color:#111827;font-size:16px;font-weight:600;margin:0 0 4px">${deadlineTitle}</p>
    <p style="color:#6b7280;font-size:14px;margin:0">Due: ${dueDate}</p>
  </div>
  <div style="text-align:center">
    <a href="https://germany-guide-1.vercel.app/deadlines" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 32px;border-radius:10px;font-weight:600;font-size:15px">
      View Deadlines
    </a>
  </div>
</div>
<p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:24px">
  Germany Guide - Navigate German bureaucracy with confidence
</p>
</div>
</body>
</html>`,
  };
}

export function visaExpiryEmail(
  name: string,
  daysLeft: number,
  expiryDate: string
): { subject: string; html: string } {
  const displayName = name || "there";
  const urgencyColor = daysLeft <= 7 ? "#dc2626" : daysLeft <= 30 ? "#d97706" : "#2563eb";
  const urgencyBg = daysLeft <= 7 ? "#fef2f2" : daysLeft <= 30 ? "#fffbeb" : "#eff6ff";
  const urgencyText =
    daysLeft === 0
      ? "Your visa expires TODAY!"
      : `Your visa expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`;

  return {
    subject: daysLeft === 0
      ? "YOUR VISA EXPIRES TODAY"
      : `Visa Expiry Warning: ${daysLeft} days remaining`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
<div style="background:#fff;border-radius:16px;padding:40px 32px;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
  <div style="font-size:48px;text-align:center;margin-bottom:16px">&#x1F6C2;</div>
  <h1 style="color:#111827;font-size:22px;margin:0 0 8px;text-align:center">Visa Expiry Alert</h1>
  <p style="color:#6b7280;font-size:15px;text-align:center;margin:0 0 24px">Hi ${displayName},</p>
  <div style="background:${urgencyBg};border-radius:12px;padding:20px;margin-bottom:24px;text-align:center">
    <p style="color:${urgencyColor};font-size:20px;font-weight:700;margin:0 0 8px">${urgencyText}</p>
    <p style="color:#6b7280;font-size:14px;margin:0">Expiry date: ${expiryDate}</p>
  </div>
  <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:24px;text-align:left">
    <p style="color:#374151;font-size:14px;font-weight:600;margin:0 0 8px">Recommended actions:</p>
    <ul style="color:#374151;font-size:14px;line-height:2;margin:0;padding-left:20px">
      <li>Book an Auslanderamt appointment</li>
      <li>Gather required renewal documents</li>
      <li>Check your guide for step-by-step help</li>
    </ul>
  </div>
  <div style="text-align:center">
    <a href="https://germany-guide-1.vercel.app/flow" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 32px;border-radius:10px;font-weight:600;font-size:15px">
      Start Renewal Guide
    </a>
  </div>
</div>
<p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:24px">
  Germany Guide - Navigate German bureaucracy with confidence
</p>
</div>
</body>
</html>`,
  };
}

export function flowCompletionEmail(
  name: string,
  flowTitle: string
): { subject: string; html: string } {
  const displayName = name || "there";
  return {
    subject: `Congratulations! You completed: ${flowTitle}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:32px 16px">
<div style="background:#fff;border-radius:16px;padding:40px 32px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
  <div style="font-size:48px;margin-bottom:16px">&#x1F389;</div>
  <h1 style="color:#111827;font-size:24px;margin:0 0 8px">Congratulations!</h1>
  <p style="color:#6b7280;font-size:15px;margin:0 0 24px">${displayName}, you have completed:</p>
  <div style="background:#f0fdf4;border-radius:12px;padding:20px;margin-bottom:24px">
    <p style="color:#15803d;font-size:20px;font-weight:700;margin:0 0 4px">&#x2713; ${flowTitle}</p>
    <p style="color:#16a34a;font-size:14px;margin:0">All steps finished!</p>
  </div>
  <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 24px">
    Great job navigating this process. Check your dashboard for more guides or track your documents.
  </p>
  <a href="https://germany-guide-1.vercel.app/dashboard" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 32px;border-radius:10px;font-weight:600;font-size:15px">
    Back to Dashboard
  </a>
</div>
<p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:24px">
  Germany Guide - Navigate German bureaucracy with confidence
</p>
</div>
</body>
</html>`,
  };
}