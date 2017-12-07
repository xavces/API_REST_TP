import express from 'express';
import database from 'app/core/bdd/bdd.js';


const myRoute = express.Router();

let orderModel;
database.modelInitOrder((orderModel2) => {
    orderModel = orderModel2;
});

// Route pour – http://localhost:3000/order
myRoute.route('/order')
// Lister les commandes (avec leurs lignes de commande)
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
// Ajouter une commande (renvoi la commande créée en cas de succès)
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
myRoute.route('/order/:id')
// Récupérer une commande (avec ses lignes de commande)
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
// Supprimer une commande
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
// Modifier une commande (renvoi la commande créée en cas de succès)
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
myRoute.route('/order/:id/confirm')
// Confirmer une commande (passe le champ statut à « confirmed »)
    .put((req, res) => {
        orderModel.findOneAndUpdate({ _id: req.params.id }, {
            status: 'confirmed',
        }, { upsert: true, new: true }, (error, result) => {
            if (error) res.json({ message: error });
            else res.json({ message: `Passe la commande dans l'état 'confirmed'${req.params.id}`, result });
        });
    });

module.exports = myRoute;
