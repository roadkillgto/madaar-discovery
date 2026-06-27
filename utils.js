// ----------------------------------------------------------------------------
// utils.js — small, dependency-free helpers shared by every other module.
// Nothing in here knows about Mada'ar's data or DOM structure — keep it that
// way, so it never has to change when listings or features change.
// ----------------------------------------------------------------------------

/** Escapes a value for safe insertion into innerHTML. */
export function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/** Maps a 0–100 rating to a tier name + CSS color variable. Used everywhere
 *  a number needs to read as "good / fair / weak" at a glance. */
export function ratingTier(value) {
    if (value >= 80) return { label: "Strong", colorVar: "--signal-green" };
    if (value >= 55) return { label: "Workable", colorVar: "--signal-amber" };
    return { label: "Limited", colorVar: "--signal-red" };
}

/**
 * Builds a small circular progress dial as an inline SVG string.
 * Used for civil-feasibility scores on listing cards. Pure function:
 * give it a number, get back markup — no DOM access, easy to test or reuse.
 */
export function createDialSVG(value, { size = 56, stroke = 6, label = "" } = {}) {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const clamped = Math.max(0, Math.min(100, value));
    const offset = circumference * (1 - clamped / 100);
    const tier = ratingTier(clamped);
    const center = size / 2;

    return `
        <svg class="dial" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${escapeHTML(label)} ${clamped} out of 100">
            <circle class="dial-track" cx="${center}" cy="${center}" r="${radius}" stroke-width="${stroke}" fill="none" />
            <circle class="dial-fill" cx="${center}" cy="${center}" r="${radius}" stroke-width="${stroke}" fill="none"
                stroke="var(${tier.colorVar})"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${offset}"
                transform="rotate(-90 ${center} ${center})" />
            <text x="${center}" y="${center + 1}" class="dial-value" text-anchor="middle" dominant-baseline="middle">${clamped}</text>
        </svg>
    `;
}

/**
 * Builds a thin horizontal "instrument" bar — used for the Access / Terrain /
 * Infrastructure sub-readouts inside a listing card.
 */
export function createBarSVG(value) {
    const clamped = Math.max(0, Math.min(100, value));
    const tier = ratingTier(clamped);
    return `
        <div class="instrument-bar" role="img" aria-label="${clamped} out of 100">
            <div class="instrument-bar-fill" style="width:${clamped}%; background:var(${tier.colorVar})"></div>
        </div>
    `;
}

/**
 * Renders a stylised moon-phase disc as inline SVG, approximated from the
 * illumination percentage and waxing/waning direction. 
 */
export function createMoonPhaseSVG(illuminationPercent, isWaxing, size = 120) {
    const r = size / 2 - 4;
    const cx = size / 2;
    const cy = size / 2;
    const litFraction = Math.max(0, Math.min(100, illuminationPercent)) / 100;
    // litFraction 0 -> shadow fully overlaps the disc (new moon)
    // litFraction 1 -> shadow fully clears the disc (full moon)
    const shadowOffset = (1 - litFraction) * -1 * r * 2 + r * 2; // 0..2r
    const direction = isWaxing ? -1 : 1;
    const shadowCx = cx + direction * shadowOffset;
    const clipId = `moonclip-${Math.round(Math.random() * 100000)}`;

    // Resolve actual colors instead of relying on var() inside the SVG
    // presentation attributes, Edge doesn't reliably resolve those here.
    const computed = getComputedStyle(document.body);
    const litColor = (computed.getPropertyValue('--text-primary') || '#F8FAFC').trim();
    const shadowColor = (computed.getPropertyValue('--bg-base') || '#070B14').trim();
    const ringColor = (computed.getPropertyValue('--accent-primary') || '#E8A055').trim();

    return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Moon phase, ${Math.round(illuminationPercent)} percent illuminated">
            <defs>
                <clipPath id="${clipId}">
                    <circle cx="${cx}" cy="${cy}" r="${r}" />
                </clipPath>
            </defs>
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="${litColor}" opacity="0.92" />
            <g clip-path="url(#${clipId})">
                <circle cx="${shadowCx}" cy="${cy}" r="${r}" fill="${shadowColor}" />
            </g>
            <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ringColor}" stroke-width="1" opacity="0.5" />
        </svg>
    `;
}
