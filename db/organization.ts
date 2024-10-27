import { randomBytes as crypt } from "crypto";

import DatabaseManager from ".";

interface Company {
  orgId?: string;
  phone: number | string;
  company: string;
  name: string;
}

interface DatabaseResult {
  success: boolean;
  data?: Company;
  error?: string;
}

export async function getCompany(
  query: Record<string, any>
): Promise<DatabaseResult | undefined> {
  try {
    const dbManager = DatabaseManager.getInstance();
    const collection = await dbManager.getCollection<any>("company");

    const company = await collection.findOne(query);

    if (company) {
      return { success: true, data: company };
    } else {
      return { success: false, error: "company not found" };
    }
  } catch (error) {
    console.error("Error fetching company:", error);
    return { success: false, error: error.message };
  }
}

export async function createCompany(
  user: Company
): Promise<DatabaseResult | undefined> {
  try {
    const orgId = generateCompanyId();

    const dbManager = DatabaseManager.getInstance();
    const collection = await dbManager.getCollection<any>("company");

    const update = {
      $setOnInsert: { ...user, phone: Number(user.phone), orgId },
    };

    const result = await collection.findOneAndUpdate(
      { phone: user.phone },
      update,
      { upsert: true, returnDocument: "after" }
    );

    if (result) {
      return {
        success: true,
        data: {
          phone: result.phone,
          name: result.name,
          company: result.company,
          orgId,
        }
      };
    }

    console.error("Create Company Failed: ", result);
  } catch (err) {
    console.error("Create Company Failed: ", err);
  }
}

function generateCompanyId(prefix = "ORG") {
  // Get current timestamp
  const timestamp = new Date().getTime();

  // Generate 4 random bytes
  const randomBytes = crypt(4).toString("hex");

  // Combine timestamp and random bytes
  const uniquePart = `${timestamp.toString(36)}${randomBytes}`;

  // Create the final ID with the prefix
  return `${prefix}_${uniquePart.toUpperCase()}`;
}
