export const add_search_params = (url, params = {}) => {
    // See: https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/URLSearchParams#examples
    const url_obj = new URL(url, window.location.href);
    return `${url_obj.origin}${url_obj.pathname}?${new URLSearchParams([
        ...Array.from(url_obj.searchParams.entries()),
        ...Object.entries(params),
    ]).toString()}`;
};
