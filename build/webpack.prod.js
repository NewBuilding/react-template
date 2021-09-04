const Config = require("./webpack.config");

const config = Config("production");

module.exports = {
  ...config,
};
