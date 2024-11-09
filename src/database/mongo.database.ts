import { Logger } from "@nestjs/common";
import { Db, MongoClient, MongoClientOptions } from "mongodb";
import { config } from "../../convict.config";

export class MongoDatabase {

    private static instance: MongoDatabase;

    private db!: Db;

    private constructor(private readonly logger?: Logger) { }

    public static getInstance = (): MongoDatabase => MongoDatabase.instance ??= new MongoDatabase();

    public getDatabase = async (): Promise<Db> => this.db ??= await this.setDatabase();

    private async setDatabase(): Promise<Db> {
        try {
            const connection = await MongoClient.connect(this.connectionUrl);
            return connection.db();
        } catch (error: unknown) {
            this.logger?.error(error);
        }
    }

    private get connectionUrl(): string {
        return `mongodb://${config.get('db.host')}/${config.get('db.name')}?retryWrites=true&w=majority`;
    }
}