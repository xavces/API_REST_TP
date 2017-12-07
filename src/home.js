import webserver from 'app/core/webserver/server.js';
import database from 'app/core/bdd/bdd.js';
import productRoute from 'app/core/route/product.js';
import orderLine from 'app/core/route/orderLine.js';
import metier from 'app/core/route/metier.js';
import order from 'app/core/route/order.js';
import express from 'express';


console.log(webserver);
webserver.start(3000, (error, express) => {
    if (!error) {
        console.log('Webserver started');
        express.use(metier);
        express.use(productRoute);
        express.use(orderLine);
        express.use(order);
    }
});

database.start((error) => {
    if (!error) {
        console.log('Database started');
    }
});

database.open((error) => {
    if (!error) {
        console.log('Database Connected');
    }
});
