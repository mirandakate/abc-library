import type { Config } from "drizzle-kit";

export default {
    schema: "./src/server/schema/index.ts",
    out: "./drizzle",
    driver: "better-sqlite",
    dbCredentials: {
        url: 'sqlite.data'
    }
} satisfies Config;