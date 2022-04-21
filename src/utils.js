export const add_search_params = (url, params = {}) => {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams#examples
    const url_obj = new URL(url, window.location.href);
    return `${url_obj.origin}${url_obj.pathname}?${new URLSearchParams([
        ...Array.from(url_obj.searchParams.entries()),
        ...Object.entries(params),
    ]).toString()}`;
};

// Export a list of WAI attributes.
export const accessibility_attributes = [
    "aria-activedescendant",
    "aria-atomic",
    "aria-autocomplete",
    "aria-busy",
    "aria-checked",
    "aria-controls",
    "aria-describedby",
    "aria-disabled",
    "aria-dropeffect",
    "aria-expanded",
    "aria-flowto",
    "aria-grabbed",
    "aria-haspopup",
    "aria-hidden",
    "aria-invalid",
    "aria-label",
    "aria-labelledby",
    "aria-level",
    "aria-live",
    "aria-multiline",
    "aria-multiselectable",
    "aria-orientation",
    "aria-owns",
    "aria-posinset",
    "aria-pressed",
    "aria-readonly",
    "aria-relevant",
    "aria-required",
    "aria-selected",
    "aria-setsize",
    "aria-sort",
    "aria-valuemax",
    "aria-valuemin",
    "aria-valuenow",
    "aria-valuetext",
    "role",
];

export default {
    add_search_params: add_search_params,
    accessibility_attributes: accessibility_attributes,
};
