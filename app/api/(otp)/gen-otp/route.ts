import { NextResponse, NextRequest } from "next/server";

import { sendOtpOnWhatsapp } from "@/lib/send-otp-on-whatsapp";

import { getUser } from "@/db/user";
import { getCompany } from "@/db/organization";
import { createOTP, insertOTP } from "@/db/otp";

async function handleOTPCreation(phone: number) {
  try {
    const { otp, hashedOtp } = await createOTP();
    console.log(otp)
    if (otp && hashedOtp) {
      await insertOTP(hashedOtp, phone);
      await sendOtpOnWhatsapp(otp, phone);
    }
  } catch (err) {}
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const phone = Number(body?.phone);

    if (!phone) {
      return NextResponse.json(
        { status: "failed", error: "Phone number is required" },
        { status: 400 }
      );
    }

    const user = await getUser({ phone });
    if (user) {
      await handleOTPCreation(phone);
      return NextResponse.json({ status: "success" }, { status: 200 });
    }

    const company = await getCompany({ phone });
    if (company) {
      await handleOTPCreation(phone);
      return NextResponse.json({ status: "success" }, { status: 200 });
    }

    return NextResponse.json(
      { status: "failed", error: "User or company not found" },
      { status: 404 }
    );
  } catch (err) {
    console.error("Error in OTP handler:", err);
    return NextResponse.json(
      { status: "error", error: "Could not process OTP request" },
      { status: 500 }
    );
  }
}
