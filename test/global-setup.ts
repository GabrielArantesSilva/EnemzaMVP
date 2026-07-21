import { execSync } from "node:child_process";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

export default async function setup() {
  const container = await new PostgreSqlContainer("postgres:16-alpine").start();
  const url = container.getConnectionUri();

  process.env.DATABASE_URL = url;
  process.env.DIRECT_URL = url;

  execSync("pnpm exec prisma migrate deploy", {
    env: { ...process.env, DATABASE_URL: url, DIRECT_URL: url },
    stdio: "inherit",
  });

  return async () => {
    await container.stop();
  };
}
