import express from 'express';

const myRoute = express.Router();



// Route pour - http://localhost:3000/dashboard/orders
myRoute.route('/dashboard/orders')
    .get((req, res) => {
        res.json({ message: "Affiche le chiffre d'affaire par mois" });
    });

// Route pour - http://localhost:3000/dashboard/product
myRoute.route('/dashboard/product')
// Affiche le produit le plus vendu
    .get((req, res) => {
        res.json({ message: 'Renvoi le produit inclus dans le plus de commandes ' });
    });

module.exports = myRoute;
