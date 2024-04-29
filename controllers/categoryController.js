const Category = require('../models/category'); // Adjust the path as needed

// Display list of all categories
exports.category_list = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('category_list', { title: 'Category List', category_list: categories });
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving categories." });
    }
};

// Display detail page for a specific category
exports.category_detail = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);
        const items = await Item.find({ category: categoryId }); // Fetch all items for this category

        if (!category) {
            return res.status(404).send('Category not found');
        }

        res.render('category_detail', {
            title: 'Category Detail',
            category: category,
            items: items // Pass the list of items to the view
        });
    } catch (error) {
        return next(error);
    }
};

// Display category create form on GET
exports.category_create_get = (req, res) => {
    res.render('category_form', { title: 'Create Category' });
};

// Handle category create on POST
exports.category_create_post = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description
    });

    try {
        await category.save();
        res.redirect(category.url);
    } catch (error) {
        res.status(500).render('category_form', { title: 'Create Category', category: category, errors: error });
    }
};

// Display category delete form on GET
exports.category_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Category delete GET');
};

// Handle category delete on POST
exports.category_delete_post = async (req, res) => {
    try {
        await Category.findByIdAndRemove(req.body.categoryid);
        res.redirect('/categories');
    } catch (error) {
        res.status(500).send({ message: "Deleting category failed." });
    }
};

// Display category update form on GET
exports.category_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Category update GET');
};

// Handle category update on POST
exports.category_update_post = async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.id // This is required, or a new ID will be assigned!
    });

    try {
        await Category.findByIdAndUpdate(req.params.id, category, {});
        res.redirect(category.url);
    } catch (error) {
        res.status(500).send({ message: "Updating category failed." });
    }
};
