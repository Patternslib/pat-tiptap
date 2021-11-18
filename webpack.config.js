process.traceDeprecation = true;
const path = require("path");
const patternslib_config = require("@patternslib/patternslib/webpack/webpack.config.js");

module.exports = async (env, argv) => {
    let config = {
        entry: {
            bundle: path.resolve(__dirname, "bundle-config.js"),
        },
    };

    config = patternslib_config(env, argv, config);
    config.output.path = path.resolve(__dirname, "dist/");

    return config;
};
