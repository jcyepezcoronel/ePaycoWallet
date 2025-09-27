const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    document: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    names: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

clientSchema.index({ document: 1, phone: 1 });

module.exports = mongoose.model("Client", clientSchema);
