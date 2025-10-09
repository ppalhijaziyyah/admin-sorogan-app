export function removeHarakat(text) {
    if (!text) return "";
    // This regex removes all harakat EXCEPT for the Shadda.
    return text.replace(/[ً-ِْ-ٰٟـ]/g, "");
}
