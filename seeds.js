const mongoose = require("mongoose");
const Farm = require("./model/farm");
const Product = require("./model/product");

main().catch((err) => console.log("Mongo Connection Error!: ", err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/groceryKart");
  console.log("✅ MongoDB Connected!");

  await Farm.deleteMany({});
  await Product.deleteMany({});

  const seedFarms = [
    { name: "Full Belly Farms", city: "Dehradun", email: "fbf@gmail.com" },
    { name: "Humpty Farms", city: "Haridwar", email: "hf@gmail.com" },
    { name: "Gospel Farms", city: "Nainital", email: "gf@gmail.com" },
    {
      name: "Organic Produce Farm",
      city: "Pithoragarh",
      email: "opf@gmail.com",
    },
    { name: "Highland Fresh", city: "Mussoorie", email: "hfresh@gmail.com" },
    { name: "Green Valley Farm", city: "Ranikhet", email: "gvf@gmail.com" },
  ];

  const farms = await Farm.insertMany(seedFarms);

  const seedProducts = [
    { name: "Fairy Eggplant", price: 1.0, category: "vegetable" },
    { name: "Organic Goddess Melon", price: 4.99, category: "fruit" },
    { name: "Mini Seedless Watermelon", price: 3.5, category: "fruit" },
    { name: "Organic Celery", price: 1.5, category: "vegetable" },
    { name: "Chocolate Whole Milk", price: 2.6, category: "dairy" },
    { name: "Ruby Grapefruit", price: 1.99, category: "fruit" },
    { name: "Sweet Corn", price: 1.25, category: "vegetable" },
    { name: "Broccoli Crown", price: 2.1, category: "vegetable" },
    { name: "Fresh Paneer", price: 5.0, category: "dairy" },
    { name: "Almond Milk", price: 3.99, category: "dairy" },
    { name: "Strawberries", price: 3.75, category: "fruit" },
    { name: "Carrots", price: 1.2, category: "vegetable" },
    { name: "Kale Bunch", price: 2.2, category: "vegetable" },
    { name: "Farm Fresh Eggs", price: 2.9, category: "dairy" },
    { name: "Zucchini", price: 1.3, category: "vegetable" },
    { name: "Spinach Bag", price: 2.5, category: "vegetable" },
    { name: "Mango", price: 1.8, category: "fruit" },
    { name: "Cucumber", price: 1.0, category: "vegetable" },
    { name: "Butter", price: 2.7, category: "dairy" },
    { name: "Papaya", price: 2.1, category: "fruit" },
  ];

  for (let prod of seedProducts) {
    const randomFarm = farms[Math.floor(Math.random() * farms.length)];
    const product = new Product({ ...prod, farm: randomFarm._id });
    await product.save();

    // Push the product into the farm's products array
    randomFarm.products.push(product);
    await randomFarm.save();
  }

  console.log("✅ Seeding Complete");
  mongoose.connection.close();
}
