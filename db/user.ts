import DatabaseManager from ".";

interface User {
  _id: string;
  phone: number;
  name: string;
}

interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getUser(query: Record<string, any>): Promise<any> {
  const dbManager = DatabaseManager.getInstance();
  
  try {
    const collection = await dbManager.getCollection<any>("user");

    const user = await collection.findOne(query);
    console.log("User ", user)
    if (user) {
      return { status: true, data: user }
    }
    
    return { status: false, error: "user not found" }
    
  } catch (error) {
    console.error("Error fetching user:", error);
    return { status: false, error: "internal server error" }
  } finally {
    // dbManager.closeConnection();
  }
}
