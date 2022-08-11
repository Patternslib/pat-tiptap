import utils from "./utils";

describe("utils tests", () => {
    it("test is_url", () => {
        // What should be true.
        expect(utils.is_url("/")).toBe(true);
        expect(utils.is_url("/okay")).toBe(true);
        expect(utils.is_url("./okay")).toBe(true);
        expect(utils.is_url("../okay")).toBe(true);
        expect(utils.is_url("https://okay")).toBe(true);
        expect(utils.is_url("http://okay")).toBe(true);
        expect(utils.is_url("ftp://okay")).toBe(true);
        expect(utils.is_url("okay://okay")).toBe(true);

        // What should be false.
        expect(utils.is_url("okay")).toBe(false);
        expect(utils.is_url("www.okay.org")).toBe(false);
        expect(utils.is_url(".../okay")).toBe(false);
    });
});
