import express from 'express';
import database from 'app/core/bdd/bdd';

/**
 * Contient toutes les routes en rapport avec une ligne de commande
 * @module myRouteOrderLine
 * @author Maxime Bozouklian <maxime.bozouklian@ynov.com>
 * @author Maximilien Costa <maximilien.costa@ynov.com>
 */

/**
 * Permet de pouvoir stocker les routes pour les exporter
 */
const myRouteOrderLine = express.Router();

/**
 * Récupère le modèle de la table orderLine.
 */
let orderLineModel;
database.modelInitOrderLine((callback) => {
    orderLineModel = callback;
});

/**
 * Récupère le modèle de la table order.
 */
let orderModel;
database.modelInitOrder((orderModel2) => {
    orderModel = orderModel2;
});


myRouteOrderLine.route('/orderline')
/**
 * Route pour lister les lignes de commandes - GET http://localhost:3000/orderline
 * @name get/orderline
 * @function
 * @memberof module:myRouteOrderLine
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */
    .get((req, res) => {
        orderLineModel.find((error, ordersLine) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({ message: 'Liste de toutes les lignes de commandes : ', ordersLine });
            }
        });
    });

myRouteOrderLine.route('/order/:order_id/line')
/**
 * Route pour ajouter une ligne de commande (renvoi la ligne créée en cas de succès) - POST http://localhost:3000/order/{order_id}/line
 * @name post/order/:order_id/line
 * @function
 * @memberof module:myRouteOrderLine
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */
    .post((req, res) => {
        const newOrderLine = new orderLineModel({
        });
        if (req.body.product) {
            if (req.body.quantity) {
                newOrderLine.product = req.body.product;
                newOrderLine.order = req.params.order_id;
                newOrderLine.quantity = req.body.quantity;
                newOrderLine.save((error) => {
                    if (error) {
                        res.json({ error });
                    } else {
                        res.json({ result: newOrderLine });
                    }
                });
            } else res.json({ message: 'Veuillez entrer la quantité du produit' });
        } else res.json({ message: 'Veuillez entrer le produit' });
    });

// Route pour – http://localhost:3000/order/{order_id}/line/{line_id}
myRouteOrderLine.route('/order/:order_id/line/:line_id')
/**
 * Route pour supprimer une ligne de commande - DELETE http://localhost:3000/order/{order_id}/line/{line_id}
 * @name delete/order/:order_id/line/:line_id
 * @function
 * @memberof module:myRouteOrderLine
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */
    .delete((req, res) => {
        orderModel.find({ _id: req.params.order_id })
            .lean().exec((error) => {
                if (error) {
                    res.json({ error });
                } else {
                    orderLineModel.remove({ _id: req.params.line_id }, (error2) => {
                        if (error2) {
                            res.json({ Error: error2 });
                        } else {
                            res.json({ message: `Suppression de la ligne de commande n°${req.params.line_id}`, etat: 'Commandes supprimé avec succés !' });
                        }
                    });
                }
            });
    })
    /**
 * Route pour modifier une ligne de commande (renvoi la ligne créée en cas de succès) - PUT http://localhost:3000/order/{order_id}/line/{line_id}
 * @name put/order/:order_id/line/:line_id
 * @function
 * @memberof module:myRouteOrderLine
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */
    .put((req, res) => {
        if (req.body.quantity) {
            orderModel.find({ _id: req.params.order_id })
                .lean().exec((error, order) => {
                    if (error) {
                        res.json({ error });
                    } else {
                        orderLineModel.findOneAndUpdate({ _id: req.params.line_id }, {
                            quantity: req.body.quantity,
                        }, { upsert: true, new: true }, (error, result) => {
                            if (error) {
                                res.json({ error });
                            } else {
                                res.json({ message: `Modification de la ligne de commande n°${req.params.line_id}`, result });
                            }
                        });
                    }
                });
        }
    });


module.exports = myRouteOrderLine;
