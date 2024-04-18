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
    
    await createCategories();
    await createItems();
    
    console.log("Closing database connection");
    mongoose.connection.close();
}
async function categoryCreate(index, name, description) {
    // Check if category already exists
    let category = await Category.findOne({ name: name });
    if (category) {
        console.log(`Category already exists: ${name}`);
        return category;  // Return the existing category if found
    }
    // Create new category if not found
    category = new Category({ name: name, description: description });
    await category.save();
    console.log(`Added category: ${name}`);
    return category;
}

async function itemCreate(index, name, description, category, price, inStock) {
    // Check if item already exists
    let item = await Item.findOne({ name: name, category: category });
    if (item) {
        console.log(`Item already exists: ${name}`);
        return item;  // Return the existing item if found
    }
    // Create new item if not found
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


async function createCategories() {
    console.log("Adding categories");
    const categories = await Promise.all([
        categoryCreate(0, "Electronics", "Devices and gadgets"),
        categoryCreate(1, "Books", "Fiction and non-fiction books"),
        categoryCreate(2, "Clothing", "Men and women's clothing"),
        categoryCreate(3, "Kitchenware", "All essentials for your kitchen needs"),
        categoryCreate(4, "Gardening", "Tools and plants for gardening"),
        categoryCreate(5, "Sports Equipment", "Gear for various sports"),
        categoryCreate(6, "Automotive", "Car parts and accessories"),
        categoryCreate(7, "Beauty Products", "Cosmetics and skincare products"),
        categoryCreate(8, "Footwear", "Shoes for all occasions"),
        categoryCreate(9, "Pet Supplies", "Goods for pet care"),
        categoryCreate(10, "Jewelry", "Elegant and custom jewelry pieces"),
        categoryCreate(11, "Toys", "Fun toys for children of all ages"),
        categoryCreate(12, "Art Supplies", "Materials for artists and hobbyists"),
        categoryCreate(13, "Musical Instruments", "Instruments for musicians"),
        categoryCreate(14, "Office Supplies", "Stationery and office essentials"),
        categoryCreate(15, "Furniture", "Home and office furniture"),
        categoryCreate(16, "Healthcare Products", "Health-related products and supplements"),
        categoryCreate(17, "Video Games", "Games and gaming consoles"),

    ]);
    return categories;
}

async function createItems() {
    console.log("Adding items");
    const categories = await Category.find(); // Fetch the categories we just added to the database
    
    await Promise.all([
        itemCreate(0, "Laptop", "High performance laptop", categories.find(cat => cat.name === "Electronics")._id, 1200, 30),
        itemCreate(1, "Smartphone", "Latest model smartphone", categories.find(cat => cat.name === "Electronics")._id, 999, 50),
        itemCreate(2, "Thriller Novel", "A thrilling mystery book", categories.find(cat => cat.name === "Books")._id, 19.99, 100),
        itemCreate(3, "Winter Jacket", "Warm and cozy", categories.find(cat => cat.name === "Clothing")._id, 89.99, 40),
        itemCreate(4, "Chef's Knife", "Stainless steel chef's knife", categories.find(cat => cat.name === "Kitchenware")._id, 25.99, 15),
        itemCreate(5, "Blender", "500W blender with multiple speed settings", categories.find(cat => cat.name === "Kitchenware")._id, 45.99, 20),
        itemCreate(6, "Garden Shovel", "Sturdy shovel for gardening", categories.find(cat => cat.name === "Gardening")._id, 22.50, 30),
        itemCreate(7, "Plant Fertilizer", "Organic fertilizer for plants", categories.find(cat => cat.name === "Gardening")._id, 15.75, 25),
        itemCreate(8, "Football", "Official size and weight football", categories.find(cat => cat.name === "Sports Equipment")._id, 19.99, 40),
        itemCreate(9, "Tennis Racket", "Carbon fiber tennis racket", categories.find(cat => cat.name === "Sports Equipment")._id, 85.50, 15),
        itemCreate(10, "Engine Oil", "Synthetic motor oil", categories.find(cat => cat.name === "Automotive")._id, 29.99, 50),
        itemCreate(11, "Windshield Wipers", "Durable windshield wipers", categories.find(cat => cat.name === "Automotive")._id, 12.99, 70),
        itemCreate(12, "Lipstick", "Long-lasting matte lipstick", categories.find(cat => cat.name === "Beauty Products")._id, 14.99, 45),
        itemCreate(13, "Moisturizer", "Daily facial moisturizer", categories.find(cat => cat.name === "Beauty Products")._id, 23.50, 30),
        itemCreate(14, "Running Shoes", "Lightweight and breathable running shoes", categories.find(cat => cat.name === "Footwear")._id, 59.99, 25),
        itemCreate(15, "Leather Boots", "Stylish leather boots", categories.find(cat => cat.name === "Footwear")._id, 89.99, 20),
        itemCreate(16, "Dog Leash", "Strong dog leash for large breeds", categories.find(cat => cat.name === "Pet Supplies")._id, 12.99, 40),
        itemCreate(17, "Cat Scratching Post", "Durable scratching post for cats", categories.find(cat => cat.name === "Pet Supplies")._id, 24.99, 30),
        itemCreate(18, "Silver Necklace", "Elegant silver necklace", categories.find(cat => cat.name === "Jewelry")._id, 49.99, 15),
        itemCreate(19, "Gold Earrings", "14k gold hoop earrings", categories.find(cat => cat.name === "Jewelry")._id, 99.99, 20),
        itemCreate(20, "Building Blocks", "Colorful building blocks for kids", categories.find(cat => cat.name === "Toys")._id, 22.99, 40),
        itemCreate(21, "Action Figure", "Collectible superhero action figure", categories.find(cat => cat.name === "Toys")._id, 15.99, 25),
    ]);
}