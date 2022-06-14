process.traceDeprecation = true;
const mf_config = require("@patternslib/patternslib/webpack/webpack.mf");
const package_json = require("./package.json");
const path = require("path");
const patternslib_config = require("@patternslib/patternslib/webpack/webpack.config.js");

module.exports = async (env, argv) => {
    let config = {
        entry: {
            "bundle.min": path.resolve(__dirname, "index.js"),
        },
    };

    config = patternslib_config(env, argv, config);
    config.output.path = path.resolve(__dirname, "dist/");

    config.plugins.push(
        mf_config({
            package_json: package_json,
            remote_entry: config.entry["bundle.min"],
        })
    );

    if (process.env.NODE_ENV === "development") {
        config.devServer.static.directory = __dirname;
    }

    return config;
};
