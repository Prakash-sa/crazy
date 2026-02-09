import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // If SMTP config is missing, return null (graceful fallback)
  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE !== "false",
    auth: { user, pass }
  });
}

export async function POST() {
  try {
    const transporter = createTransporter();

    // If no transporter, just return success (development mode)
    if (!transporter) {
      console.log("SMTP not configured - running in dev mode");
      return NextResponse.json({ 
        ok: true, 
        message: "Development mode: email not sent (SMTP not configured)" 
      });
    }

    const toEmail = process.env.ALERT_TO_EMAIL || "sainiprakash525@gmail.com";
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: "She clicked Yes on your Sorry page",
      text: "Appology update: Vibha clicked Yes button and has forgiven you.",
      html: "<p>Apology update: <strong>Vibha clicked Yes button and has forgiven you.</strong></p>"
    });

    return NextResponse.json({ 
      ok: true, 
      message: "Email sent successfully" 
    });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to send email"
      },
      { status: 500 }
    );
  }
}
