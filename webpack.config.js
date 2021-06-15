process.traceDeprecation = true;
const path = require("path");
const patternslib_config = require("@patternslib/patternslib/webpack/webpack.config.js");
const vue_config = require("./webpack.vue");

module.exports = async (env, argv) => {
    const config = vue_config(env, argv, patternslib_config(env, argv));

    config.entry = {
        bundle: path.resolve(__dirname, "bundle-config.js"),
    };
    config.output.path = path.resolve(__dirname, "dist/");

    return config;
};
