const PaymentService = require("./payment.service");
const ErrorHandler = require("../../utils/errorHandler");

exports.listMine = async (req, res) => {
  try {
    const payments = await PaymentService.listMine(req.user.id);
    res.json({ payments });
  } catch (error) {
    return ErrorHandler.handle(error, res, "List payments");
  }
};

exports.getById = async (req, res) => {
  try {
    const payment = await PaymentService.getById(req.params.id, req.user);
    res.json({ payment });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Get payment");
  }
};

exports.createPayment = async (req, res) => {
  try {
    const payment = await PaymentService.createPayment(req.user.id, req.body);
    res.status(201).json({ message: "Payment record created", payment });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Create payment");
  }
};

exports.patchStatus = async (req, res) => {
  try {
    const payment = await PaymentService.updatePaymentStatus(
      req.params.id,
      req.user,
      req.body
    );
    res.json({ message: "Payment updated", payment });
  } catch (error) {
    return ErrorHandler.handle(error, res, "Update payment");
  }
};
