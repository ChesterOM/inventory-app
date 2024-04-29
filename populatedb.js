#! /usr/bin/env node

console.log(
    'This script populates some test categories and items to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://youruser:yourpassword@yourcluster.mongodb.net/yourdatabase"'
  );

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log("Connecting to the database");
    await mongoose.connect(mongoDB);
    console.log("Database connected");
    
    const categories = await createCategories();
    await createItems(categories);
    
    console.log("Closing database connection");
    mongoose.connection.close();
}

async function createCategories() {
    console.log("Adding categories");
    return await Promise.all([
        categoryCreate(0, "Electronics", "Devices and gadgets"),
        categoryCreate(1, "Books", "Fiction and non-fiction books"),
        categoryCreate(2, "Clothing", "Men and women's clothing"),
        categoryCreate(3, "Kitchenware", "All essentials for your kitchen needs"),
        categoryCreate(4, "Sports Equipment", "Gear for various sports"),
    ]);
}

async function createItems(categories) {
    console.log("Adding items");
    let items = [];
    categories.forEach((category, index) => {
        for (let i = 1; i <= 10; i++) {
            items.push(itemCreate(index * 10 + i, `Product ${i}`, `Description for product ${i}`, category._id, 20 + i * 5, 10 + i * 2));
        }
    });
    await Promise.all(items);
}

async function categoryCreate(index, name, description) {
    let category = await Category.findOne({ name: name });
    if (category) {
        console.log(`Category already exists: ${name}`);
        return category;  // Return the existing category if found
    }
    category = new Category({ name: name, description: description });
    await category.save();
    console.log(`Added category: ${name}`);
    return category;
}

async function itemCreate(index, name, description, category, price, inStock) {
    let item = await Item.findOne({ name: name, category: category });
    if (item) {
        console.log(`Item already exists: ${name}`);
        return item;  // Return the existing item if found
    }
    item = new Item({
        name: name,
        description: description,
        category: category,
        price: price,
        inStock: inStock
    });
    await item.save();
    console.log(`Added item: ${name}`);
    return item;
}
