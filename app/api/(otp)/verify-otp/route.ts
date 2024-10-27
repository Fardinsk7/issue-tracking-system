import { NextResponse, NextRequest } from "next/server";

import { getUser } from "@/db/user";
import { verifyOTP } from "@/db/otp";
import { getCompany } from "@/db/organization";
import { signToken, USER_TOKEN } from "@/utils/jwt";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    const phone = Number(body?.phone) as number;
    const otp = Number(body?.otp) as number;

    if (!phone) {
      return NextResponse.json(
        { status: "failed", error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (!otp) {
      return NextResponse.json(
        { status: "failed", error: "OTP is required" },
        { status: 400 }
      );
    }

    const user = await getUser({ phone });
    console.log(user)
    if (user.status) {
      const isValidOtp = await verifyOTP(otp, phone);
      console.log(isValidOtp)
      if (isValidOtp.status === false) {
        return NextResponse.json(
          { status: "failed", message: isValidOtp.error },
          {
            status: 400,
          }
        );
      } else {
        const accessToken = await signToken({
          name: user.data.name,
          role: user.data.role,
          phone: user.data.phone,
          userVerificationStatus:user.data.userVerificationStatus,
          _id: user.data._id?.toString(),
        });

        return NextResponse.json(
          { status: "success", data: user.data },
          {
            status: 200,
            headers: {
              "Set-Cookie": `${USER_TOKEN}=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax`,
            },
          }
        );
      }
    }

    const company = await getCompany({ phone });
    console.log(company)
    if (company.success) {
      const isValidOtp = await verifyOTP(otp, phone);

      if (isValidOtp.status === false) {
        return NextResponse.json(
          { status: "failed", message: isValidOtp.error },
          {
            status: 400,
          }
        );
      } else {
        const accessToken = await signToken({
          name: company.data?.name,
          phone: company.data?.phone,
          role: user.data.role,
          _id: company.data?.orgId,
        });
        console.log(accessToken)
        return NextResponse.json(
          { status: "success" , data: company.data },
          {
            status: 200,
            headers: {
              "Set-Cookie": `${USER_TOKEN}=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax`,
            },
          }
        );
      }
    }

    return NextResponse.json(
      { status: "failed", message: "user or company not found" },
      { status: 404 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Could not verify OTP" },
      { status: 500 }
    );
  }
}
