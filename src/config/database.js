const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["error"],
  transactionOptions: {
    isolationLevel: "RepeatableRead",
    maxWait: 20000,
    timeout: 180000,
  },
});

module.exports = prisma;
