import express from 'express';
import database from 'app/core/bdd/bdd';

/**
 * Contient toutes les routes en rapport avec un produit
 * @module myRouteProduct
 * @author Maxime Bozouklian <maxime.bozouklian@ynov.com>
 * @author Maximilien Costa <maximilien.costa@ynov.com>
 */

/**
 * Permet de pouvoir stocker les routes pour les exporter
 */
const myRouteProduct = express.Router();

/**
 * Récupère le modèle de la table product.
 */
let productModel;
database.modelInitProduct((callback) => {
    productModel = callback;
});

// Route de base pour l'affichage de la page d'accueil
myRouteProduct.route('/')
// Pour n'importe quelle requête, on met ce message
    .all((req, res) => {
        res.json({ message: 'Bienvenue sur notre API ', methode: req.method });
    });

// Route pour – http://localhost:3000/product
myRouteProduct.route('/product')
/**
 * Route pour lister les produits - GET http://localhost:3000/product
 * @name get/product
 * @function
 * @memberof module:myRouteProduct
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */

    .get((req, res) => {
        productModel.find((error, product) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({ message: 'Liste de tout les produits : ', product });
            }
        });
    })
    /**
 * Route pour ajouter une produit (renvoi le produit créée en cas de succès) - GET http://localhost:3000/product
 * @name post/product
 * @function
 * @memberof module:myRouteProduct
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */
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
myRouteProduct.route('/product/:id')
    /**
 * Route pour récupérer un produit - GET http://localhost:3000/product/{id}
 * @name post/product/:id
 * @function
 * @memberof module:myRouteProduct
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */

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

    /**
 * Route pour supprimer un produit - DELETE http://localhost:3000/product/{id}
 * @name delete/product/:id
 * @function
 * @memberof module:myRouteProduct
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */
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
/**
 * Route pour modifier un produit (renvoi le produit créé en cas de succès) - PUT http://localhost:3000/product/{id}
 * @name put/product/:id
 * @function
 * @memberof module:myRouteProduct
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */

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
module.exports = myRouteProduct;
