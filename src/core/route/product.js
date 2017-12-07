import express from 'express';
import database from 'app/core/bdd/bdd.js';

const myRoute = express.Router();

let productModel;
database.modelInitProduct((productModel2) => {
    productModel = productModel2;
});

// Route de base pour l'affichage de la page d'accueil
myRoute.route('/')
// Pour n'importe quelle requête, on met ce message
    .all((req, res) => {
        res.json({ message: 'Bienvenue sur notre API ', methode: req.method });
    });

// Route pour – http://localhost:3000/product
myRoute.route('/product')
// Lister les produits
    .get((req, res) => {
        productModel.find((error, product) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({ message: 'Liste de tout les produits : ', product });
            }
        });
    })
// Ajouter une produit (renvoi le produit créée en cas de succès)
    .post((req, res) => {
        const newProduct = new productModel({
        });
        if (req.body.name) {
            if (req.body.price) {
                newProduct.name = req.body.name;
                newProduct.price = req.body.price;
                newProduct.save((error) => {
                    if (error) {
                        res.json({ error });
                    } else {
                        res.json({ result: newProduct });
                    }
                });
            } else res.json({ message: 'Veuillez entrer le prix du produit' });
        } else res.json({ message: 'Veuillez entrer le nom du produit' });
    });


// Route pour – http://localhost:3000/product/{id}
myRoute.route('/product/:id')
// Récupérer un produit
    .get((req, res) => {
    // Recherche et affiche toute la commande
        productModel.find({ _id: req.params.id })
            .lean().exec((error, product) => {
                if (error) {
                    res.json({ error });
                } else {
                    res.json({
                        message: `Récupération produit n°${req.params.id}`,
                        produit: product,
                    });
                }
            });
    })
// Supprimer un produit
    .delete((req, res) => {
    // Supprime la commande avec l'id passer en paramètre
        productModel.remove({ _id: req.params.id }, (error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({ message: `Suppression du produit n°${req.params.id}`, etat: 'Produit supprimé avec succés !' });
            }
        });
    })
// Modifier un produit (renvoi le produit créé en cas de succès)
    .put((req, res) => {
        if (req.body.price) {
            productModel.findOneAndUpdate({ _id: req.params.id }, {
                price: req.body.price,
            }, { upsert: true, new: true }, (error, result) => {
                if (error) {
                    res.json({ error });
                } else {
                    res.json({ message: `Modification du produit n°${req.params.id}`, result });
                }
            });
        } else res.json({ error: 'Veuillez entrer un prix' });
    });
module.exports = myRoute;
