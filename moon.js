// ----------------------------------------------------------------------------
// moon.js — lunar phase / illumination calculation, and the "Tonight's Sky"
// panel that sits inside the page header. Self-contained: nothing else
// reads or writes this module's state, so it can be edited or replaced
// without touching listings, filters, or Ask a Local.
// ----------------------------------------------------------------------------

import { createMoonPhaseSVG } from "./utils.js";

const SYNODIC_MONTH_DAYS = 29.53058867;
const REFERENCE_NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Approximate lunar phase for a given date. Good enough for trip planning;
 * not an ephemeris-grade calculation.
 */
export function getMoonInfo(dateInput) {
    const date = new Date(dateInput);
    const daysSinceReference = (date.getTime() - REFERENCE_NEW_MOON_UTC) / MS_PER_DAY;
    let moonAge = daysSinceReference % SYNODIC_MONTH_DAYS;
    if (moonAge < 0) moonAge += SYNODIC_MONTH_DAYS;

    const angle = (2 * Math.PI * moonAge) / SYNODIC_MONTH_DAYS;
    const illumination = ((1 - Math.cos(angle)) / 2) * 100;
    const roundedIllumination = Math.round(illumination);
    const isWaxing = moonAge < SYNODIC_MONTH_DAYS / 2;

    let phase = "New Moon";
    if (moonAge < 1.85) phase = "New Moon";
    else if (moonAge < 5.54) phase = "Waxing Crescent";
    else if (moonAge < 9.23) phase = "First Quarter";
    else if (moonAge < 12.92) phase = "Waxing Gibbous";
    else if (moonAge < 16.61) phase = "Full Moon";
    else if (moonAge < 20.30) phase = "Waning Gibbous";
    else if (moonAge < 23.99) phase = "Last Quarter";
    else if (moonAge < 27.68) phase = "Waning Crescent";

    let quality = "Not ideal";
    let advice = "The moon is bright. Choose a lower-illumination night for the best stargazing.";
    if (roundedIllumination <= 20) {
        quality = "Excellent";
        advice = "Very dark skies. One of the best nights to visit.";
    } else if (roundedIllumination <= 50) {
        quality = "Good";
        advice = "Good conditions, especially after moonset or away from direct moonlight.";
    } else if (roundedIllumination <= 75) {
        quality = "Fair";
        advice = "Some stars will still be visible, but moonlight will mute the deep sky.";
    }

    return { phase, illumination: roundedIllumination, quality, advice, isWaxing };
}

function formatDate(date) {
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function findBestUpcomingDates(startDate, count = 4, windowDays = 30) {
    const bestDates = [];
    for (let i = 0; i < windowDays; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(checkDate.getDate() + i);
        const info = getMoonInfo(checkDate);
        if (info.illumination <= 20) {
            bestDates.push({ date: formatDate(checkDate), illumination: info.illumination });
        }
        if (bestDates.length === count) break;
    }
    return bestDates;
}

/**
 * Wires up the "Tonight's Sky" panel: date input, live moon disc, readouts,
 * and the upcoming dark-night list. Call once on page load.
 */
export function initMoonPanel() {
    const dateInput = document.getElementById("visit-date");
    const discHolder = document.getElementById("moon-disc");
    const phaseEl = document.getElementById("moon-phase");
    const illumEl = document.getElementById("moon-illumination");
    const qualityEl = document.getElementById("stargazing-quality");
    const adviceEl = document.getElementById("moon-advice");
    const bestDatesEl = document.getElementById("best-dates-list");

    if (!dateInput || !discHolder || !phaseEl || !illumEl || !qualityEl || !adviceEl || !bestDatesEl) {
        console.warn("Mada'ar: sky panel elements missing — skipping moon panel init.");
        return;
    }

    function render() {
        const selectedDate = dateInput.value ? new Date(dateInput.value) : new Date();
        const info = getMoonInfo(selectedDate);

        discHolder.innerHTML = createMoonPhaseSVG(info.illumination, info.isWaxing, 120);
        phaseEl.textContent = info.phase;
        illumEl.textContent = `${info.illumination}%`;
        qualityEl.textContent = info.quality;
        qualityEl.dataset.quality = info.quality.toLowerCase().replace(" ", "-");
        adviceEl.textContent = info.advice;

        const bestDates = findBestUpcomingDates(selectedDate);
        bestDatesEl.innerHTML = bestDates.length
            ? bestDates.map(d => `<li><span>${d.date}</span><span class="mono">${d.illumination}%</span></li>`).join("")
            : `<li>No very dark nights in the next 30 days — check next month.</li>`;
    }

    dateInput.valueAsDate = new Date();
    dateInput.addEventListener("change", render);
    render();
}
