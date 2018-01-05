const config = require('./config');
const Scout = require(process.versalink.scout);
const Vl6180 = require('./vl6180');

module.exports = class Vl6180Scout extends Scout {

  constructor(opts) {

    super();

    if (typeof opts !== 'undefined') {
      // copy all config options defined in the server
      for (const key in opts) {
        if (typeof opts[key] !== 'undefined') {
          config[key] = opts[key];
        }
      }
    }

    if (config.name === undefined) { config.name = "VL6180" }
    this.name = config.name;

    this.vl6180 = new Vl6180(config);

  }

  init(next) {
    const query = this.server.where({name: this.name});
  
    const self = this;

    this.server.find(query, function(err, results) {
      if (!err) {
        if (results[0]) {
          self.provision(results[0], self.vl6180);
          self.server.info('Provisioned known device ' + self.name);
        } else {
          self.discover(self.vl6180);
          self.server.info('Discovered new device ' + self.name);
        }
      }
      else {
        self.server.error(err);
      }
    });

    next();
  }

}

