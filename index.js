// Webpack entry point for module federation.
import "@patternslib/dev/webpack/module_federation";
// The next import needs to be kept with brackets, otherwise we get this error:
// "Shared module is not available for eager consumption."
import("./bundle-config");
