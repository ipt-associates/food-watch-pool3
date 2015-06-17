var path = require("path"),
    appRoot = path.join(__dirname, "../app");

module.exports = {
    appRoot: appRoot,
    clientSourceFiles: appRoot + "**/*.js",
    clientOutputDir: appRoot + "/dist/"
};
