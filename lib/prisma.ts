import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prism = global.prisma || new PrismaClient({
  log: ["query"], // Optionally log queries for debugging
});

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prism;
