module.exports = {
    rootDir: "./src",
    setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
    watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
        "^.+\\.vue$": "vue-jest",
    },
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    },
    transformIgnorePatterns: ["/node_modules/(?!.*patternslib/*).+\\.[t|j]sx?$"],
};
