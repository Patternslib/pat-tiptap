import Base from "@patternslib/patternslib/src/core/base";
import Parser from "@patternslib/patternslib/src/core/parser";
import logging from "@patternslib/patternslib/src/core/logging";

const log = logging.getLogger("form-data-event");

export const parser = new Parser("form-data-event");
parser.addArgument("event-name-submit");
parser.addArgument("event-name-init");
parser.addArgument("prevent-submit", true);
parser.addArgument("close-modal", true);

export default Base.extend({
    name: "form-data-event",
    trigger: ".pat-form-data-event",

    init() {
        this.options = parser.parse(this.el, this.options);
        if (this.el.tagName !== "FORM") {
            log.warn("pattern must be initialized on a form element.");
            return;
        }
        if (this.options.event["name-submit"]) {
            this.el.addEventListener("submit", this.handle_submit.bind(this));
        }
        if (this.options.event["name-init"]) {
            document.addEventListener(
                this.options.event["name-init"],
                this.handle_init.bind(this),
                { once: true }
            );
        }
    },

    handle_submit(e) {
        if (this.options.preventSubmit) {
            e.preventDefault();
        }
        const form_data = new FormData(this.el);
        if (e.submitter?.name) {
            form_data.append("action", e.submitter.name);
        }
        const ev = new CustomEvent(this.options.event["name-submit"], {
            detail: { form_data: form_data },
        });
        document.dispatchEvent(ev);
        if (this.options.closeModal) {
            const modal = this.el.closest(".pat-modal");
            if (modal) {
                modal["pattern-modal"].destroy();
            }
        }
        if (this.options.event["name-init"]) {
            document.removeEventListener(
                this.options.event["name-init"],
                this.handle_init
            );
        }
    },

    handle_init(e) {
        const form_data = e?.detail?.form_data;
        for (const [key, value] of form_data.entries()) {
            const _el = this.el[key];
            if (_el) {
                if (_el.type === "checkbox") {
                    _el.checked = value === "true";
                } else {
                    _el.value = value;
                }
            }
        }
    },
});
