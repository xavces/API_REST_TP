var chai = require('chai');
var chaiHttp = require('chai-http');
import webserver from 'app/core/webserver/server.js';
import productRoute from 'app/core/route/product.js';
import orderLine from 'app/core/route/orderLine.js';
import metier from 'app/core/route/metier.js';
import order from 'app/core/route/order.js';
import { expect } from 'chai';


var id = null;
chai.use(chaiHttp);


describe('Test', function() {
  it('Test connexion server', function(done){
    webserver.start(3001, (err, express) => {
        if (!err) {
            express.use(metier);
            express.use(productRoute);
            express.use(orderLine);
            express.use(order);
            expect(true).to.be.true;
        }else{
          expect(err).to.be.null;
        }

    });
    webserver.close();
    done();
  });

});

describe('Test GET, POST, PUT, DELETE', function() {
  it('Lister les commandes /order GET', function(done) {
    chai.request('http://localhost:3000')
      .get('/order')
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Ajout d\'une commande /order POST', function(done) {
    chai.request('http://localhost:3000')
      .post('/order')
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        id = res.body['_id'];
        done();
      });
  });

  it('Supprimer une commande /order/:id DELETE', function(done) {
    chai.request('http://localhost:3000')
      .delete('/order/'+id)
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Ajout d\'une commande pour le test /order POST', function(done) {
    chai.request('http://localhost:3000')
      .post('/order')
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        id = res.body['_id'];
        done();
      });
  });

  it('Modifie une commande /order/:id PUT', function(done) {
    chai.request('http://localhost:3000')
      .put('/order/'+id)
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        done();
      });
  });


});
