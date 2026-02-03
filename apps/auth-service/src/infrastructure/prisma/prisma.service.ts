/* eslint-disable turbo/no-undeclared-env-vars */
import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/generated/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }

  public async onModuleInit() {
    try {
      this.logger.log("🔄 Initializing database connection...");
      await this.$connect();
      await this.$queryRaw`SELECT 1`;
      this.logger.log("✅ Database connection established successfully.");
    } catch (error) {
      this.logger.error("❌ Failed to establish database connection.", error);
      throw error;
    }
  }

  public async onModuleDestroy() {
    try {
      this.logger.log("🔻 Closing database connection...");
      await this.$disconnect();
      this.logger.log("🟢 Database connection closed successfully.");
    } catch (error) {
      this.logger.error(
        "⚠️ Error occurred while closing the database connection.",
        error,
      );
      throw error;
    }
  }
}
