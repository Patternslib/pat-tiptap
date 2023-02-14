import utils from "./utils";

describe("utils tests", () => {
    it("test is_url", () => {
        // What should be true.
        expect(utils.is_url("/")).toBe(true);
        expect(utils.is_url("/okay")).toBe(true);
        expect(utils.is_url("./okay")).toBe(true);
        expect(utils.is_url("../okay")).toBe(true);
        expect(utils.is_url("https://okay")).toBe(true);
        expect(utils.is_url("https://okay.com:1234")).toBe(true);
        expect(utils.is_url("http://okay")).toBe(true);
        expect(utils.is_url("ftp://okay")).toBe(true);
        expect(utils.is_url("okay://okay")).toBe(true);

        expect(utils.is_url("data:1234")).toBe(true);
        expect(utils.is_url("mailto:test@test.at")).toBe(true);

        // What should be false.
        expect(utils.is_url("okay")).toBe(false);
        expect(utils.is_url("www.okay.org")).toBe(false);
        expect(utils.is_url(".../okay")).toBe(false);
        expect(utils.is_url("okay.com:1234")).toBe(false);
        expect(utils.is_url("test@test.at")).toBe(false);
    });

    it("test is_mail", () => {
        // What should be true.
        expect(utils.is_mail("mailto:test@test.at")).toBe(true);
        expect(utils.is_mail("test@test.at")).toBe(true);

        // What should be false.
        expect(utils.is_mail("/")).toBe(false);
        expect(utils.is_mail("/okay")).toBe(false);
        expect(utils.is_mail("./okay")).toBe(false);
        expect(utils.is_mail("../okay")).toBe(false);
        expect(utils.is_mail("https://okay")).toBe(false);
        expect(utils.is_mail("https://okay.com:1234")).toBe(false);
        expect(utils.is_mail("http://okay")).toBe(false);
        expect(utils.is_mail("ftp://okay")).toBe(false);
        expect(utils.is_mail("okay://okay")).toBe(false);
        expect(utils.is_mail("data:1234")).toBe(false);
        expect(utils.is_mail("okay")).toBe(false);
        expect(utils.is_mail("www.okay.org")).toBe(false);
        expect(utils.is_mail(".../okay")).toBe(false);
        expect(utils.is_mail("okay.com:1234")).toBe(false);
    });
});
