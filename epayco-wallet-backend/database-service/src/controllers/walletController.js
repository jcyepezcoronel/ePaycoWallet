const Client = require("../models/Client");
const AppError = require("../utils/appError");
const { buildResponse } = require("../utils/responseBuilder");

const parseAmount = (value) => {
  const amount = Number(value);
  if (Number.isNaN(amount) || amount <= 0) {
    throw new AppError({
      message: "El valor de la recarga debe ser mayor a cero",
      code: "INVALID_AMOUNT",
    });
  }
  return amount;
};

const topUpWallet = async (req, res, next) => {
  try {
    const { document, phone, celular: phoneFromLegacy, value, amount } = req.body;
    const normalizedPhone = phone || phoneFromLegacy;
    if (!document || !normalizedPhone) {
      throw new AppError({
        message: "El documento y el número de celular son obligatorios",
        code: "VALIDATION_ERROR",
      });
    }

    const topUpAmount = parseAmount(value ?? amount);

    const client = await Client.findOne({ document, phone: normalizedPhone });
    if (!client) {
      throw new AppError({
        message: "Cliente no encontrado",
        code: "CLIENT_NOT_FOUND",
        statusCode: 404,
      });
    }

    client.walletBalance += topUpAmount;
    await client.save();

    res.json(
      buildResponse({
        success: true,
        code: "WALLET_TOPPED_UP",
        message: "Recarga aplicada correctamente",
        data: {
          walletBalance: client.walletBalance,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

const getWalletBalance = async (req, res, next) => {
  try {
    const { document, phone, celular: phoneFromLegacy } = { ...req.query, ...req.body };
    const normalizedPhone = phone || phoneFromLegacy;

    if (!document || !normalizedPhone) {
      throw new AppError({
        message: "Debe suministrar documento y número de celular",
        code: "VALIDATION_ERROR",
      });
    }

    const client = await Client.findOne({ document, phone: normalizedPhone });
    if (!client) {
      throw new AppError({
        message: "Cliente no encontrado",
        code: "CLIENT_NOT_FOUND",
        statusCode: 404,
      });
    }

    res.json(
      buildResponse({
        success: true,
        code: "BALANCE_RETRIEVED",
        message: "Saldo consultado correctamente",
        data: {
          walletBalance: client.walletBalance,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { topUpWallet, getWalletBalance };
