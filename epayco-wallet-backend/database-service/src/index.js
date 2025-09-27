const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_DB_URI;
const dbName = process.env.MONGO_DB_NAME;

if (!mongoUri || !dbName) {
  console.error("Missing MongoDB configuration. Please set MONGO_DB_URI and MONGO_DB_NAME.");
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    dbName,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Database service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
