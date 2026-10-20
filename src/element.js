export const canvas = document.getElementById("canvas");



export function registerCanvas(
    iframe = document.querySelector("iframe")
) {
    if (!(iframe instanceof HTMLIFrameElement)) {
        throw new TypeError("Iframe element not found or invalid");
    }

    return iframe;
}