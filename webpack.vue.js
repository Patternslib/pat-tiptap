const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = (env, argv, config) => {
    // Vue Plugin config snippet
    config.resolve.alias.vue$ = "vue/dist/vue.esm.js";
    config.resolve.extensions = ["*", ".js", ".vue", ".json"];
    config.module.rules.push({
        test: /\.vue$/,
        loader: "vue-loader",
    });
    config.plugins.push(new VueLoaderPlugin());
    return config;
};
