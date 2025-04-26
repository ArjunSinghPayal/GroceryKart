const mongoose = require("mongoose");
const Product = require("./model/product");

main().catch((err) => console.log("Mongo Connection Error!: ", err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/groceryKart");
  console.log("✅ MongoDB Connected!");

  const seedProducts = [
    {
      name: "Fairy Eggplant",
      price: 1.0,
      category: "vegetable",
    },
    {
      name: "Organic Goddess Melon",
      price: 4.99,
      category: "fruit",
    },
    {
      name: "Organic Mini Seedless Watermelon",
      price: 4.99,
      category: "fruit",
    },
    {
      name: "Organic Celery",
      price: 1.5,
      category: "vegetable",
    },
    {
      name: "Chocolate Whole Milk",
      price: 2.6,
      category: "dairy",
    },
    {
      name: "Ruby Grapefruit",
      price: 1.99,
      category: "fruit",
    },
  ];

  try {
    await Product.insertMany(seedProducts);
    console.log(await Product.find({}));
  } catch (err) {
    console.log("Oh No! Error Occured!!!: ", err.message);
  }

  mongoose.connection.close();
}
