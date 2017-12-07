import mongoose from 'mongoose';

let productModel;
let orderModel;
let orderLineModel;

class Database {
    constructor() {
        this.mongoose = null;
        this.db = null;

        this.productSchema = new mongoose.Schema({
            name: String,
            price: Number,
        });
        this.orderSchema = new mongoose.Schema({
            code: String,
            date: { type: Date, default: Date.now },
            total: Number,
            status: { type: String, default: 'draft' },
        });
        this.orderLineSchema = new mongoose.Schema({
            product: String,
            order: String,
            quantity: Number,
        });
    }

    start(callback) {
        mongoose.connect('mongodb://localhost:27017/data', { useMongoClient: true }, (error) => {
            if (typeof callback === 'function') {
                callback(error);
            }
        });

        this.db = mongoose.connection;
    }

    open(callback) {
        this.db.on('error', (error) => {
            if (typeof callback === 'function') {
                callback(error);
            }
        });
        this.db.once('open', (error) => {
            if (typeof callback === 'function') {
                callback(error);
            }
        });
    }

    modelInitOrder(callback) {
        if (orderModel == null) { this.orderModel = mongoose.model('order', this.orderSchema); }
        callback(this.orderModel);
    }
    modelInitProduct(callback) {
        if (productModel == null) { this.productModel = mongoose.model('product', this.productSchema); }
        callback(this.productModel);
    }
    modelInitOrderLine(callback) {
        if (orderLineModel == null) { this.orderLineModel = mongoose.model('orderLine', this.orderLineSchema); }
        callback(this.orderLineModel);
    }
}
export default new Database();
