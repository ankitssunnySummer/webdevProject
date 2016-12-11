/**
 * Created by Ankit on 10/30/2016.
 */

module.exports = function(app) {

    var models = require("./model/models.server")();
    require("./services/user.service.server.js")(app, models);
    require("./services/website.service.server.js")(app, models);
    require("./services/page.service.server.js")(app, models);
    require("./services/widget.service.server.js")(app, models);
  };