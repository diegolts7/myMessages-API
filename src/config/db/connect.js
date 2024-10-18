const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.xp42p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("Conexão com o banco de dados bem-sucedida");
  } catch (err) {
    console.log("Erro na conexão com o banco", err);
  }
}

module.exports = connectToDatabase;
