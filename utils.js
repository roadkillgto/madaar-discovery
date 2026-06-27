export function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


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
