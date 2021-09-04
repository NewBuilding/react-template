const PSD_JS_SCRIPT_ID = "psd_js";

export function importPsd() {
  return new Promise<any>((resolve, reject) => {
    if (document.body.querySelector(`#${PSD_JS_SCRIPT_ID}`)) {
      resolve(window.require("psd"));
      return;
    }
    const script = document.createElement("script");
    script.src = "/public/psd.min.js";
    script.addEventListener("load", () => {
      resolve(window.require("psd"));
    });
    script.id = PSD_JS_SCRIPT_ID;
    script.addEventListener("error", () => {
      reject();
    });
    document.body.append(script);
  });
}
