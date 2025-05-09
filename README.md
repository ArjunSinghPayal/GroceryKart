# GroceryKart

🛒 GroceryKart

- A simple yet powerful CRUD app to manage your grocery store's inventory. Built with Express, MongoDB, Mongoose, and a sprinkle of Bootstrap magic!

* A powerful CRUD app for managing farms and their products — built with Express, MongoDB, Mongoose relationships, and a sprinkle of Bootstrap magic!

✨ Features

     📋 Create, Read, Update, and Delete products easily.

     🔍 Filter products by category like fruits, vegetables, and dairy.

     🎨 Beautiful UI with Bootstrap 5 styling.

     ⚡ Dynamic form validations and smart error handling.

     🧹 Clean MVC-style folder structure (views/products, partials, layout).

     🔥 Fully responsive design — looks good on mobile, tablet, and desktop!

-
- 🌾 Supports farm-product relationships — link products to farms and vice versa.
-
- 🔄 Automatically delete farm's products when the farm is deleted (via Mongoose middleware).
-
- 📦 Seed script with randomized farm and product data.

🚀 Tech Stack

     Backend: Node.js, Express.js

- Database: MongoDB (Mongoose ODM)

* Database: MongoDB with Mongoose (object modeling + relationships)

  Templating: EJS + EJS-Mate (for layouts)

  Styling: Bootstrap 5

  Utilities: Method-Override for PUT and DELETE support

🛠️ Setup Instructions

# Clone the repository

git clone https://github.com/ArjunSinghPayal/GroceryKart.git

# Navigate into the project directory

cd GroceryKart

# Install dependencies

npm install

# Make sure MongoDB is running locally

- +# Optionally seed the database with:
  +node seeds.js

  # Then start the server

  node index.js

  Visit http://localhost:8080/products to see it in action!

🤔 Future Improvements

     Add authentication for users.

     Improve validation error messages.

-
- Add search and filtering by farm.
-
- Farm dashboard to show all products with nested rendering.

  Deploy online on Render, Vercel, or Railway.

🧑‍💻 Author

     GitHub: ArjunSinghPayal

🎯 Final Thought

"A small project, but a BIG leap towards becoming a Full Stack Developer!"
