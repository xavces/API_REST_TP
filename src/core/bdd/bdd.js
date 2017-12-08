import mongoose from 'mongoose';

let productModel;
let orderModel;
let orderLineModel;

/**
 * Classe de la base de donnée Mongoose
 *
 * @author Maxime Bozouklian <maxime.bozouklian@ynov.com>
 * @author Maximilien Costa <maximilien.costa@ynov.com>
 */
class Database {
    constructor() {
        this.mongoose = null;
        this.db = null;

        /**
         * Initialisation du schéma du produit
         */
        this.productSchema = new mongoose.Schema({
            name: String,
            price: Number,
        });
        /**
         * Initialisation du schéma de la commande
         */
        this.orderSchema = new mongoose.Schema({
            code: String,
            date: { type: Date, default: Date.now },
            total: Number,
            status: { type: String, default: 'draft' },
        });
        /**
         * Initialisation du schéma de la ligne de commande
         */
        this.orderLineSchema = new mongoose.Schema({
            product: String,
            order: String,
            quantity: Number,
        });
    }
    /**
     * Se connecte à la base de donnée
     * @method Database#start
     * @param {function} callback - Renvoi l'erreur
     */
    start(callback) {
        mongoose.connect('mongodb://localhost:27017/data', { useMongoClient: true }, (error) => {
            if (typeof callback === 'function') {
                callback(error);
            }
        });

        this.db = mongoose.connection;
    }
    /**
     * Accède à la base de donnée
     * @method Database#open
     * @param {function} callback - Renvoi l'erreur
     */
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
    /**
     * Initialise le modèle order de la base de donnée mongoose pour l'envoie des requête sous la bonne forme
     * @method Database#modelInitOrder
     * @param {function} callback - Renvoi le modèle
     */
    modelInitOrder(callback) {
        if (orderModel == null) { this.orderModel = mongoose.model('order', this.orderSchema); }
        callback(this.orderModel);
    }
    /**
     * Initialise le modèle product de la base de donnée mongoose pour l'envoie des requête sous la bonne forme
     * @method Database#modelInitProduct
     * @param {function} callback - Renvoi le modèle
     */
    modelInitProduct(callback) {
        if (productModel == null) { this.productModel = mongoose.model('product', this.productSchema); }
        callback(this.productModel);
    }
    /**
     * Initialise le modèle orderLine de la base de donnée mongoose 
     * pour l'envoie des requête sous la bonne forme
     * @method Database#modelInitOrderLine
     * @param {function} callback - Renvoi le modèle
     */
    modelInitOrderLine(callback) {
        if (orderLineModel == null) { this.orderLineModel = mongoose.model('orderLine', this.orderLineSchema); }
        callback(this.orderLineModel);
    }
}
export default new Database();
