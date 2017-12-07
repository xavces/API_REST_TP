import express from 'express';
import bodyParser from 'body-parser';

// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });

/**
 *Wrapper arround an express webserver
 *
 * #author Maxime Bozouklian <maxime.bozouklian@ynov.com>
 */

class Webserver {
    constructor() {
        this.express = null;
        this.server = null;
        this.route = null;
    }

    start(port, callback) {
        this.express = express();
        this.express.use(jsonParser);
        this.express.use(urlencodedParser);
        this.route = express.Router();

        this.server = this.express.listen(port, (error) => {
            if (typeof callback === 'function') {
                callback(error, this.express, this.route);
            }
        });
    }
    close(callback) {
        if (this.server === null) {
            callback(new err('Web Server is not running'));
        } else {
            this.server.close((error) => {
                if (typeof callback === 'function') {
                    callback(error);
                }
            });
        }
    }
}

export default new Webserver();
