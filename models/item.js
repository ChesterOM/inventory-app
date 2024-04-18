const mongoose = require('mongoose');
const Category = require('./category')
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {type: String, required: true, maxLength: 60},
    description: {type: String, required: true, maxLength: 200},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true },
    inStock: {type: Number, required: true },
    price: {type: Number, required: true },
});

ItemSchema.virtual('url').get(function () {
    return `/${this.category.name}/${this._id}`
})

module.exports = mongoose.model('Item', ItemSchema);
