import express from 'express';
import database from 'app/core/bdd/bdd';

/**
 * Contient toutes les routes en rapport avec une commande
 * @module myRouteOrder
 * @author Maxime Bozouklian <maxime.bozouklian@ynov.com>
 * @author Maximilien Costa <maximilien.costa@ynov.com>
 */

/**
 * Permet de pouvoir stocker les routes pour les exporter
 */
const myRouteOrder = express.Router();

/**
 * Récupère le modèle de la table order.
 */
let orderModel;
database.modelInitOrder((callback) => {
    orderModel = callback;
});


myRouteOrder.route('/order')
/**
 * Route pour lister les commandes (avec leurs lignes de commande) - GET http://localhost:3000/order
 * @name get/order
 * @function
 * @memberof module:myRouteOrder
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */
    .get((req, res) => {
        // Recherche et affiche toute les commandes
        orderModel.find(null)
            .lean().exec((error, order) => {
                if (error) {
                    res.json({ error });
                } else {
                    res.json({
                        message: 'Liste de toutes les commandes : ',
                        commande: order,
                    });
                }
            });
    })

/**
 * Route pour ajouter une commande (renvoi la commande créée en cas de succès) - POST http://localhost:3000/order
 * @name post/order
 * @function
 * @memberof module:myRouteOrder
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */
    .post((req, res) => {
        const newOrder = new orderModel({
        });
        newOrder.total = 0;
        newOrder.code = newOrder._id;
        newOrder.save((error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json(newOrder);
            }
        });
    });

// Route pour – http://localhost:3000/order/{id}
myRouteOrder.route('/order/:id')
/**
 * Route pour récupérer une commande (avec ses lignes de commande) - GET http://localhost:3000/order/{id}
 * @name get/order/:id
 * @function
 * @memberof module:myRouteOrder
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */
    .get((req, res) => {
        // Recherche et affiche toute la commande
        orderModel.find({ _id: req.params.id })
            .lean().exec((error, order) => {
                if (error) {
                    res.json({ error });
                } else {
                    res.json({
                        message: `Récupération commande n°${req.params.id}`,
                        commande: order,
                    }); // Vérifier sans le JSON.stringify ce que ça retourne
                }
            });
    })
/**
 * Route pour supprimer une commande - DELETE http://localhost:3000/order/{id}
 * @name delete/order/:id
 * @function
 * @memberof module:myRouteOrder
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */
    .delete((req, res) => {
        // Supprime la commande avec l'id passer en paramètre
        orderModel.remove({ _id: req.params.id }, (error) => {
            if (error) {
                res.json({ error });
            } else {
                res.json({ message: `Suppression commande n°${req.params.id}`, etat: 'Commandes supprimé avec succés !' });
            }
        });
    })
/**
 * Route pour modifier une commande (renvoi la commande créée en cas de succès) - PUT http://localhost:3000/order/{id}
 * @name put/order/:id
 * @function
 * @memberof module:myRouteOrder
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */

    .put((req, res) => {
        if (req.body.total) {
            orderModel.findOneAndUpdate({ _id: req.params.id }, {
                total: req.body.total,
                date: Date.now(),
            }, { upsert: true, new: true }, (error, result) => {
                if (error) {
                    res.json({ error });
                } else {
                    res.json({ message: `Modification de la commande n°${req.params.id}`, result });
                }
            });
        } else {
            res.json({ error: 'Veuillez entrer le total' });
        }
    });

// Route pour – http://localhost:3000/order/{id}/confirm
myRouteOrder.route('/order/:id/confirm')
/**
 * Route pour confirmer une commande (passe le champ statut à « confirmed ») - PUT http://localhost:3000/order/{id}/confirm
 * @name put/order/:id/confirm
 * @function
 * @memberof module:myRouteOrder
 * @inner
 * @param {json} req - Express requête
 * @param {json} res - Express response.
 */

    .put((req, res) => {
        orderModel.findOneAndUpdate({ _id: req.params.id }, {
            status: 'confirmed',
        }, { upsert: true, new: true }, (error, result) => {
            if (error) res.json({ message: error });
            else res.json({ message: `Passe la commande dans l'état 'confirmed'${req.params.id}`, result });
        });
    });

module.exports = myRouteOrder;
