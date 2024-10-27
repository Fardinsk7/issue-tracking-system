import { NextResponse, NextRequest } from "next/server";

import { signToken, USER_TOKEN } from "@/utils/jwt";
import { getCompany, createCompany } from "@/db/organization";

interface Signup {
  name: string;
  phone: string | number;
  company: string;
}

interface Validation {
  status: boolean;
  error: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body)
    const company: {
      name: string;
      phone: string | number;
      company: string;
    } = {
      name: body?.name,
      phone: body?.phone,
      company: body?.organization,
    };
    console.log(company)
    const isValid: Validation = validateSignupForm(company);

    if (isValid.status === false) {
      return NextResponse.json(
        { status: "error", message: isValid.error },
        {
          status: 400,
        }
      );
    }

    const isCompany = await getCompany({ phone: company.phone });

    if (!isCompany.success) {
      return NextResponse.json(
        { status: "error", message: "Phone number already exists" },
        {
          status: 400,
        }
      );
    }

    const newCompany = await createCompany(company);

    if (newCompany.success) {
      const data = {
        name: newCompany.data.name,
        phone: newCompany.data.phone,
        company: newCompany.data.company,
        id: newCompany.data.orgId,
      };

      const accessToken = await signToken(data);

      return NextResponse.json(
        {
          status: "success",
          message: "Organization created successfully",
          data,
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": `${USER_TOKEN}=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax`,
          },
        }
      );
    }

    throw new Error("Failed to sign up")
  } catch (err) {
    return NextResponse.json(
      { status: "error", message: err.message },
      {
        status: 500,
      }
    );
  }
}

function validateSignupForm({ name, phone, company }: Signup): Validation {
  let error: string | undefined;

  try {
    if (!name) {
      error = "Name is required";
    }

    if (!phone) {
      error = "Phone number is required";
    }

    if (!company) {
      error = "Company name is required";
    }

    if (typeof name !== "string") {
      error = "Invalid type name should be a string";
    }

    if (typeof phone !== "string") {
      error = "Invalid type phone should be a string";
    }

    if (typeof company !== "string") {
      error = "Invalid type company should be a string";
    }

    if (error) {
      throw new Error(error);
    }

    return { status: true, error: "" };
  } catch (err) {
    console.error(err.message);
    return { status: false, error: err.message };
  }
}
