import { MongoClient, Collection, Db } from "mongodb";

export default class DatabaseManager {
  private static instance: DatabaseManager;
  
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private async connect(): Promise<void> {
    if (!this.client) {
      const uri = process.env.MONGODB_URI;
      const dbName = process.env.DB_NAME;

      if (!uri || !dbName) {
        throw new Error(
          "Missing MongoDB connection details in environment variables"
        );
      }

      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db(dbName);
    }
  }

  public async getDatabase(): Promise<Db> {
    await this.connect();

    if (!this.db) {
      throw new Error("Database connection not established");
    }
    
    return this.db;
  }

  public async getCollection<T>(
    collectionName: string
  ): Promise<Collection<T>> {
    const db = await this.getDatabase();
    return db.collection<T>(collectionName);
  }

  public async closeConnection(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}
