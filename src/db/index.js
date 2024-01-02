const process = require("../config");
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.db.url);

    console.info(`MongoDB Connected: ${connection.connection.host}`);
  } catch (err) {
    console.error("No ha sido posible realizar una conexión con la BBDD");
    console.error(` Error: ${err.message} `);

    throw err;
  }
};

module.exports = connectDB;
