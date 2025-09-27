const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["error", "warn", "info"],
  transactionOptions: {
    isolationLevel: "RepeatableRead",
    maxWait: 20000,
    timeout: 180000,
  },
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

prisma.$transaction = async (fn, options = {}) => {
  const defaultOptions = {
    isolationLevel: "RepeatableRead",
    maxWait: 20000,
    timeout: 180000,
  };

  return await prisma.$transaction(fn, { ...defaultOptions, ...options });
};

// Graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;
