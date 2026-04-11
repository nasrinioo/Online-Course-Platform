const prisma = require("../../config/database");
const Payment = require("./payment.model");

exports.listMine = async (userId) => {
  return await Payment.listByUser(userId);
};

exports.getById = async (id, user) => {
  const row = await Payment.findById(id);
  if (!row) throw new Error("Payment not found");
  if (row.userId !== user.id && user.role !== "ADMIN") {
    throw new Error("Not authorized to view this payment");
  }
  return row;
};

exports.createPayment = async (userId, body) => {
  const course = await prisma.course.findFirst({
    where: { id: body.courseId, deletedAt: null, isPublished: true },
    select: { id: true, price: true },
  });
  if (!course) throw new Error("Course not found");

  const amount =
    body.amount !== undefined && body.amount !== null
      ? Number(body.amount)
      : course.price;
  if (Number.isNaN(amount) || amount < 0) {
    throw new Error("Invalid payment amount");
  }

  return await Payment.create({
    userId,
    courseId: course.id,
    amount,
    currency: body.currency || "USD",
    paymentMethod: body.paymentMethod || null,
    transactionId: body.transactionId || null,
    status: "PENDING",
  });
};

exports.updatePaymentStatus = async (id, user, { status, transactionId }) => {
  if (user.role !== "ADMIN") {
    throw new Error("Not authorized to update payment status");
  }
  const extra = {};
  if (transactionId !== undefined) extra.transactionId = transactionId;
  return await Payment.updateStatus(id, status, extra);
};
