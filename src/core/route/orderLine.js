import express from 'express';
import database from 'app/core/bdd/bdd';

const myRoute = express.Router();

let orderLineModel;
database.modelInitOrderLine((callback) => {
    orderLineModel = callback;
});

let orderModel;
database.modelInitOrder((orderModel2) => {
    orderModel = orderModel2;
});


// Liste orderLine
myRoute.route('/orderline').get((req, res) => {
    orderLineModel.find((error, ordersLine) => {
        if (error) {
            res.json({ error });
        } else {
            res.json({ message: 'Liste de toutes les lignes de commandes : ', ordersLine });
        }
    });
});

// Route pour – http://localhost:3000/order/{order_id}/line
myRoute.route('/order/:order_id/line')
// Ajouter une ligne de commande (renvoi la ligne créée en cas de succès)
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
myRoute.route('/order/:order_id/line/:line_id')
// Supprimer une ligne de commande
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
// Modifier une ligne de commande (renvoi la ligne créée en cas de succès)
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


module.exports = myRoute;
