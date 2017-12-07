import webserver from 'app/core/webserver/server';
import database from 'app/core/bdd/bdd';
import productRoute from 'app/core/route/product';
import orderLine from 'app/core/route/orderLine';
import metier from 'app/core/route/metier';
import order from 'app/core/route/order';


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
