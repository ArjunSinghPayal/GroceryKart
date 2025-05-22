const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressLayouts = require("express-ejs-layouts");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ErrorHandler");
const { farmSchema, productSchema } = require("./schema");
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {
  secret: "thisisademosecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionOptions));
app.use(flash());

const Product = require("./model/product");
const Farm = require("./model/farm");

const port = 8080;
const categories = ["fruit", "vegetable", "dairy"];

main().catch((err) => console.log("Mongo Connection Error!: ", err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/groceryKartv2");
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

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const validateFarm = (req, res, next) => {
  const { error } = farmSchema.validate(req.body);
  if (error)
    throw new ExpressError(error.details.map((e) => e.message).join(", "), 400);
  next();
};

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error)
    throw new ExpressError(error.details.map((e) => e.message).join(", "), 400);
  next();
};

//Farm Routes

app.get(
  "/farms",
  catchAsync(async (req, res) => {
    const farms = await Farm.find({});
    res.render("farms/index", { farms });
  })
);

app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});

app.get(
  "/farms/:id",
  catchAsync(async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate("products");
    if (!farm) {
      req.flash("error", "Cannot find that farm!");
      return res.redirect("/farms");
    }
    res.render("farms/show", { farm });
  })
);

app.post(
  "/farms",
  validateFarm,
  catchAsync(async (req, res) => {
    const farm = new Farm(req.body);
    await farm.save();
    req.flash("success", "Successfully created a new farm!");
    res.redirect("/farms");
  })
);

app.get(
  "/farms/:id/products/new",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if (!farm) {
      req.flash("error", "Cannot find that farm!");
      return res.redirect("/farms");
    }
    res.render("products/new", { categories, farm });
  })
);

app.post(
  "/farms/:id/products",
  validateProduct,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if (!farm) {
      throw new ExpressError("Farm not found", 404);
    }

    const { name, price, category } = req.body;
    const product = new Product({ name, price, category, farm: farm._id });

    farm.products.push(product);
    await farm.save();
    await product.save();

    req.flash("success", "Product successfully added to farm!");
    res.redirect(`/farms/${farm._id}`);
  })
);

app.delete(
  "/farms/:id",
  catchAsync(async (req, res) => {
    const farm = await Farm.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted a farm!");
    res.redirect("/farms");
  })
);

//Product Routes
app.get(
  "/products",
  catchAsync(async (req, res) => {
    const { category } = req.query;
    const products = category
      ? await Product.find({ category })
      : await Product.find({});
    res.render("products/index", { products, category: category || "All" });
  })
);

app.get(
  "/products/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("farm", "name");
    if (!product) {
      req.flash("error", "Cannot find that product!");
      return res.redirect("/products");
    }
    res.render("products/show", { product });
  })
);

app.get(
  "/products/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      req.flash("error", "Cannot find that product!");
      return res.redirect("/products");
    }
    res.render("products/edit", { product, categories });
  })
);

app.put(
  "/products/:id",
  validateProduct,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    req.flash("success", "Successfully edited a Product!");
    res.redirect(`/products/${updatedProduct._id}`);
  })
);

app.delete(
  "/products/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a Product!");
    res.redirect("/products");
  })
);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log("Listening on port: ", port);
});
