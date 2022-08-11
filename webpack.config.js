process.traceDeprecation = true;
const mf_config = require("@patternslib/dev/webpack/webpack.mf");
const package_json = require("./package.json");
const path = require("path");
const patternslib_package_json = require("@patternslib/patternslib/package.json");
const webpack_config = require("@patternslib/dev/webpack/webpack.config").config;

module.exports = () => {
    let config = {
        entry: {
            "bundle.min": path.resolve(__dirname, "index.js"),
        },
    };

    config = webpack_config({
        config: config,
        package_json: package_json,
    });
    config.output.path = path.resolve(__dirname, "dist/");

    config.plugins.push(
        mf_config({
            name: package_json.name,
            remote_entry: config.entry["bundle.min"],
            dependencies: {
                ...patternslib_package_json.dependencies,
                ...package_json.dependencies,
            },
        })
    );

    if (process.env.NODE_ENV === "development") {
        config.devServer.static.directory = __dirname;
    }

    return config;
};
