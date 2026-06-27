// ----------------------------------------------------------------------------
// config.js — the single source of truth for every category in Mada'ar.

export const CATEGORIES = {
    "Astrotourism": {
        icon: iconStar(),
        group: "experience",
        blurb: "Stargazing sites and night-sky experiences."
    },
    "Farm Tours": {
        icon: iconCamel(),
        group: "experience",
        blurb: "Working camel farms open to visitors."
    },
    "Safety Check-in": {
        icon: iconCompass(),
        group: "experience",
        blurb: "Non-emergency guidance for visitors."
    },
   "Community Board": {
        icon: iconFlag(),
        group: "experience",
        blurb: "Community-wide notices and protocols."
    }
};
export const ROAD_TYPES = {
    "car": "Normal Car OK",
    "4x4-recommended": "4x4 Recommended",
    "4x4-required": "4x4 Required"
};

function iconStar() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3l1.8 5.6L19.5 9l-4.6 3.5L16.5 18 12 14.6 7.5 18l1.6-5.5L4.5 9l5.7-0.4L12 3z" stroke-linejoin="round"/></svg>`;
}
function iconCamel() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 18c1-3 2-3 3-3s1.5 1 2.5 1 1-1.5 2-2.5 2.5 1 3.5 1 1.5-2 2.5-3 2.5 1 3.5 4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="18.5" cy="9" r="1.4"/><path d="M17 10.5l-1.2 2M9 13v5M14 12.5V18" stroke-linecap="round"/></svg>`;
}
function iconCompass() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5l-2 5-3-2 5-3z" stroke-linejoin="round"/></svg>`;
}
function iconFlag() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 21V4" stroke-linecap="round"/><path d="M5 4h13l-3 3.5L18 11H5" stroke-linejoin="round"/></svg>`;
}
function iconMoon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" stroke-linejoin="round"/></svg>`;
}
function iconChat() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 5h16v10H9l-4 4V5z" stroke-linejoin="round"/></svg>`;
}
