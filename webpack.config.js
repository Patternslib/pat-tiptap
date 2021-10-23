process.traceDeprecation = true;
const path = require("path");
const patternslib_config = require("@patternslib/patternslib/webpack/webpack.config.js");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = async (env, argv) => {
    let config = {
        entry: {
            bundle: path.resolve(__dirname, "index.js"),
        },
    };
    config = patternslib_config(env, argv, config);

    config.output.path = path.resolve(__dirname, "dist/");

    if (process.env.NODE_ENV === "development") {
        config.devServer.static = {
            directory: __dirname,
        };
    }

    config.plugins.push(
        new ModuleFederationPlugin({
            shared: {
                "@patternslib/patternslib": {
                    singleton: true,
                },
            },
        })
    );

    return config;
};
