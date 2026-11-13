
import "dotenv/config";

// Prisma тохиргооны функцүүдийг импортлох
import { defineConfig, env } from "prisma/config";

// Prisma-ийн үндсэн тохиргоо
export default defineConfig({

    // Database-ийн загвар байрлах файл
    schema: "prisma/schema.prisma",

    // Migration файлууд хадгалагдах хавтас
    migrations: {
        path: "prisma/migrations",
    },

    // .env файлаас DATABASE_URL унших
    datasource: {
        url: env("DATABASE_URL"),
    },
});
