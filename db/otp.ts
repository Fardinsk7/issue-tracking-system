import crypto from "crypto";
import bcrypt from "bcryptjs";

import DatabaseManager from ".";

function generateOTP() {
  return crypto.randomInt(100000, 999999);
}

async function hashOTP(otp: number) {
  return await bcrypt.hash(otp.toString(), 10);
}

export async function createOTP() {
  const otp = generateOTP();
  const hashedOtp = await hashOTP(otp);

  return { otp, hashedOtp };
}

export async function insertOTP(otp: string, phone: number) {
  const dbManager = DatabaseManager.getInstance();

  const collection = await dbManager.getCollection<any>("otps");

  return await collection.insertOne({
    phone,
    otp,
    expiry: Date.now() + 3 * 60 * 1000,
  });
}

export async function verifyOTP(otp: number, phone: number) {
  const dbManager = DatabaseManager.getInstance();

  try {
    const collection = await dbManager.getCollection<any>("otps");

    const otpRecord = await collection
      .aggregate([
        {
          $match: {
            phone,
          },
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $limit: 1,
        },
      ])
      .toArray();

    if (!otpRecord || otpRecord.length === 0) {
      return { status: false, error: "Invalid OTP" };
    }

    // Check if the OTP has expired
    if (Date.now() > otpRecord[0].expiry) {
      return { status: false, error: "OTP has expired, request a new one" };
      //   return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Check if the OTPs match
    const otpMatch = await bcrypt.compare(otp.toString(), otpRecord[0].otp);

    if (!otpMatch) {
      return { status: false, error: "Invalid OTP" };
      //   return NextResponse.json(
      //     { error: "Invalid phone number or OTP" },
      //     { status: 400 }
      //   );z
    }

    const res = await collection.deleteMany({ phone });

    return { status: true };
  } catch (err) {
    console.error(err);
    return { status: false, error: "Could not verify OTP" };
  }
}
