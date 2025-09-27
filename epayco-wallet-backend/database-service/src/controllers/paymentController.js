const mongoose = require("mongoose");
const Client = require("../models/Client");
const PaymentSession = require("../models/PaymentSession");
const AppError = require("../utils/appError");
const { buildResponse } = require("../utils/responseBuilder");
const { generateSessionId, generateSixDigitToken } = require("../utils/tokenGenerator");

const parseAmount = (value) => {
  const amount = Number(value);
  if (Number.isNaN(amount) || amount <= 0) {
    throw new AppError({
      message: "El valor de la compra debe ser mayor a cero",
      code: "INVALID_AMOUNT",
    });
  }
  return amount;
};

const initiatePayment = async (req, res, next) => {
  try {
    const { document, phone, celular: phoneFromLegacy, amount, value, description } = req.body;
    const normalizedPhone = phone || phoneFromLegacy;
    if (!document || !normalizedPhone) {
      throw new AppError({
        message: "El documento y el número de celular son obligatorios",
        code: "VALIDATION_ERROR",
      });
    }

    const paymentAmount = parseAmount(amount ?? value);

    const client = await Client.findOne({ document, phone: normalizedPhone });
    if (!client) {
      throw new AppError({
        message: "Cliente no encontrado",
        code: "CLIENT_NOT_FOUND",
        statusCode: 404,
      });
    }

    if (client.walletBalance < paymentAmount) {
      throw new AppError({
        message: "Saldo insuficiente en la billetera",
        code: "INSUFFICIENT_FUNDS",
        statusCode: 400,
      });
    }

    const sessionId = generateSessionId();
    const token = generateSixDigitToken();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PaymentSession.create({
      sessionId,
      client: client._id,
      amount: paymentAmount,
      description,
      token,
      expiresAt,
    });

    res.status(201).json(
      buildResponse({
        success: true,
        code: "PAYMENT_TOKEN_SENT",
        message: "Se ha generado un token de sesion",
        data: {
          sessionId,
          token,
          expiresAt,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

const confirmPayment = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { sessionId, token } = req.body;
    if (!sessionId || !token) {
      throw new AppError({
        message: "Debe enviar el id de sesión y el token",
        code: "VALIDATION_ERROR",
      });
    }

    session.startTransaction();

    const paymentSession = await PaymentSession.findOne({ sessionId }).session(session);
    if (!paymentSession) {
      throw new AppError({
        message: "Sesión de pago no encontrada",
        code: "SESSION_NOT_FOUND",
        statusCode: 404,
      });
    }

    if (paymentSession.status !== "PENDING") {
      throw new AppError({
        message: "La sesión de pago ya fue procesada",
        code: "SESSION_ALREADY_PROCESSED",
        statusCode: 409,
      });
    }

    if (paymentSession.expiresAt < new Date()) {
      paymentSession.status = "EXPIRED";
      await paymentSession.save({ session });
      throw new AppError({
        message: "El token ha expirado",
        code: "TOKEN_EXPIRED",
        statusCode: 410,
      });
    }

    if (paymentSession.token !== token) {
      throw new AppError({
        message: "Token inválido",
        code: "INVALID_TOKEN",
        statusCode: 401,
      });
    }

    const client = await Client.findById(paymentSession.client).session(session);
    if (!client) {
      throw new AppError({
        message: "Cliente no encontrado",
        code: "CLIENT_NOT_FOUND",
        statusCode: 404,
      });
    }

    if (client.walletBalance < paymentSession.amount) {
      throw new AppError({
        message: "Saldo insuficiente en la billetera",
        code: "INSUFFICIENT_FUNDS",
        statusCode: 400,
      });
    }

    client.walletBalance -= paymentSession.amount;
    await client.save({ session });

    paymentSession.status = "CONFIRMED";
    paymentSession.confirmedAt = new Date();
    await paymentSession.save({ session });

    await session.commitTransaction();

    res.json(
      buildResponse({
        success: true,
        code: "PAYMENT_CONFIRMED",
        message: "El pago fue confirmado y el saldo descontado",
        data: {
          walletBalance: client.walletBalance,
          confirmedAt: paymentSession.confirmedAt,
        },
      })
    );
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(error);
  } finally {
    session.endSession();
  }
};

module.exports = { initiatePayment, confirmPayment };
