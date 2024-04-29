const Item = require('../models/item'); // Adjust the path as needed
const Category = require('../models/category'); // For category reference

// Display list of all items
exports.item_list = async (req, res) => {
    try {
        const items = await Item.find().populate('category');
        res.render('item_list', { title: 'Item List', item_list: items });
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving items." });
    }
};

// Display detail page for a specific item
exports.item_detail = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('category');
        if (!item) res.status(404).send("No item found");
        res.render('item_detail', { title: 'Item Detail', item: item });
    } catch (error) {
        res.status(500).send({ message: "Error retrieving item." });
    }
};

// Display item create form on GET
exports.item_create_get = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('item_form', { title: 'Create Item', categories: categories });
    } catch (error) {
        res.status(500).send({ message: "Error loading form." });
    }
};

// Handle item create on POST
exports.item_create_post = async (req, res) => {
    const item = new Item({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        inStock: req.body.inStock
    });

    try {
        await item.save();
        res.redirect(item.url);
    } catch (error) {
        res.status(500).render('item_form', { title: 'Create Item', item: item, errors: error });
    }
};

// Display item delete form on GET
exports.item_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Item delete GET');
};

// Handle item delete on POST
exports.item_delete_post = async (req, res) => {
    try {
        await Item.findByIdAndRemove(req.body.itemid);
        res.redirect('/items');
    } catch (error) {
        res.status(500).send({ message: "Deleting item failed." });
    }
};

// Display item update form on GET
exports.item_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Item update GET');
};

// Handle item update on POST
exports.item_update_post = async (req, res) => {
    const item = new Item({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        inStock: req.body.inStock,
        _id: req.params.id // This is required, or a new ID will be assigned!
    });

    try {
        await Item.findByIdAndUpdate(req.params.id, item, {});
        res.redirect(item.url);
    } catch (error) {
        res.status(500).send({ message: "Updating item failed." });
    }
};

