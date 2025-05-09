const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressLayouts = require("express-ejs-layouts");

const Product = require("./model/product");
const Farm = require("./model/farm");

const port = 8080;
const categories = ["fruit", "vegetable", "dairy"];

main().catch((err) => console.log("Mongo Connection Error!: ", err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/groceryKart");
  console.log("✅ MongoDB Connected!");
}

app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressLayouts);

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

//Farm Routes

app.get("/farms", async (req, res) => {
  const farms = await Farm.find({});
  res.render("farms/index", { farms });
});

app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

app.get("/farms/:id", async (req, res) => {
  const farm = await Farm.findById(req.params.id).populate("products");
  res.render("farms/show", { farm });
});

app.post("/farms", async (req, res) => {
  const farm = new Farm(req.body);
  await farm.save();
  res.redirect("/farms");
});

app.get("/farms/:id/products/new", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  res.render("products/new", { categories, farm });
});

app.post("/farms/:id/products", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  const { name, price, category } = req.body;
  const product = new Product({ name, price, category });
  farm.products.push(product);
  product.farm = farm;
  await farm.save();
  await product.save();
  res.redirect(`/farms/${farm._id}`);
});

app.delete("/farms/:id", async (req, res) => {
  const farm = await Farm.findByIdAndDelete(req.params.id);
  res.redirect("/farms");
});

//Product Routes
//Index Route
app.get("/products", async (req, res) => {
  try {
    const { category } = req.query;
    const products = category
      ? await Product.find({ category })
      : await Product.find({});
    res.render("products/index", { products, category: category || "All" });
  } catch (err) {
    res.status(500).send("Something went wrong loading the products");
  }
});

//Form for new product
app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

//Post route for Creating a new product
app.post("/products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`);
  } catch (err) {
    res.status(400).send("Failed to create product: ", err.message);
  }
});

//Show Route
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("farm", "name");
    if (!product) throw new Error("Product not found");
    res.render("products/show", { product });
  } catch (err) {
    res.status(404).send("Product not found");
  }
});

//Edit Form
app.get("/products/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");
    res.render("products/edit", { product, categories });
  } catch (err) {
    res.status(404).send("Cannont find product to edit.");
  }
});

//Update route using PUT
app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect(`/products/${updatedProduct._id}`);
  } catch (err) {
    res.status(400).send("Failed to update product: " + e.message);
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.redirect("/products");
  } catch (err) {
    res.status(500).send("Failed to delete product.");
  }
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
