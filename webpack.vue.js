// Depend on (snippet from package.json):
// {
//     "dependencies": {
//         "vue": "^2.6.12",
//         "vue-async-computed": "^3.9.0"
//     },
//     "devDependencies": {
//         "vue-jest": "^4.0.1",
//         "vue-loader": "^15.9.6",
//         "vue-template-compiler": "^2.6.12"
//     }
// }
//
// Use in webpack like:
// const vue_config = require("./webpack.vue");
// module.exports = async (env, argv) => {
//     const config = vue_config(env, argv, patternslib_config(env, argv));
//     [...]
// }
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
