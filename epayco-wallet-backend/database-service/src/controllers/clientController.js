const Client = require("../models/Client");
const AppError = require("../utils/appError");
const { buildResponse } = require("../utils/responseBuilder");

const registerClient = async (req, res, next) => {
  try {
    const { document, names, email, celular: phoneFromLegacy, phone } = req.body;
    const normalizedPhone = phone || phoneFromLegacy;

    if (!document || !names || !email || !normalizedPhone) {
      throw new AppError({
        message: "Todos los campos son obligatorios",
        code: "VALIDATION_ERROR",
      });
    }

    const existingClient = await Client.findOne({
      $or: [{ document }, { email }],
    });

    if (existingClient) {
      throw new AppError({
        message: "El cliente ya se encuentra registrado",
        code: "CLIENT_EXISTS",
        statusCode: 409,
      });
    }

    const client = await Client.create({
      document,
      names,
      email,
      phone: normalizedPhone,
    });

    res.status(201).json(
      buildResponse({
        success: true,
        code: "CLIENT_REGISTERED",
        message: "Cliente registrado exitosamente",
        data: {
          clientId: client._id,
          walletBalance: client.walletBalance,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { registerClient };
