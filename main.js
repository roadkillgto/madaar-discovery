import { CATEGORIES } from "./config.js";
import { madaarSites, localGuidance } from "./data.js";
import { initMoonPanel } from "./moon.js";
import { escapeHTML, createDialSVG, createBarSVG } from "./utils.js";

const grid = document.getElementById("hub-grid");
const filterControls = document.getElementById("filter-controls");

// ----------------------------
// Ask a Local Logic
// ----------------------------
function getLocalAnswer(questionText) {
    const text = questionText.toLowerCase();
    const match = localGuidance.find(item =>
        item.keywords.some(keyword => text.includes(keyword))
    );

    if (match) {
        return match.answer;
    }
    return "Local tip: Confirm your visit with the host before arriving. Ask about road access, arrival time, parking, lighting rules, and whether the site is suitable for families.";
}

function showLocalAnswer(questionText) {
    const output = document.getElementById("local-answer");
    const input = document.getElementById("local-question");
    if (!output) return;

    const finalQuestion = questionText || (input ? input.value : "");

    if (!finalQuestion.trim()) {
        output.innerHTML = "Type a question or choose a quick question above.";
        return;
    }

    output.innerHTML = `
        <div style="margin-bottom: 8px; color: var(--horizon-amber);"><strong>Q: ${escapeHTML(finalQuestion)}</strong></div>
        <div style="color: var(--starlight-white);">A: ${escapeHTML(getLocalAnswer(finalQuestion))}</div>
    `;
}

// ----------------------------
// Render Logic
// ----------------------------
function createCard(data) {
    const categoryConfig = CATEGORIES[data.category];
    const icon = categoryConfig ? categoryConfig.icon : "";
    
    // Build the engineering rows based on the structured data
    const accessRow = `
        <div class="eng-row">
            <div class="eng-row-top"><span>Access</span><span>${data.engineering.access.rating}/100</span></div>
            ${createBarSVG(data.engineering.access.rating)}
            <div class="eng-row-note">${escapeHTML(data.engineering.access.note)}</div>
        </div>
    `;
    const terrainRow = `
        <div class="eng-row">
            <div class="eng-row-top"><span>Terrain</span><span>${data.engineering.terrain.rating}/100</span></div>
            ${createBarSVG(data.engineering.terrain.rating)}
            <div class="eng-row-note">${escapeHTML(data.engineering.terrain.note)}</div>
        </div>
    `;
    const infraRow = `
        <div class="eng-row">
            <div class="eng-row-top"><span>Infrastructure</span><span>${data.engineering.infrastructure.rating}/100</span></div>
            ${createBarSVG(data.engineering.infrastructure.rating)}
            <div class="eng-row-note">${escapeHTML(data.engineering.infrastructure.note)}</div>
        </div>
    `;

    return `
        <div class="card">
            <h3>${escapeHTML(data.name)}</h3>
            <div class="tag-row">
                <span class="tag">${icon} ${escapeHTML(data.category)}</span>
            </div>
            
            <p class="provider"><strong>By:</strong> ${escapeHTML(data.provider)}</p>
            <p class="description">${escapeHTML(data.description)}</p>

            <div class="engineering-box">
                <div class="eng-header">
                    <h4>Civil Feasibility</h4>
                    <div class="dial-container">
                        ${createDialSVG(data.civilScore, { size: 48, stroke: 4, label: "Overall Score" })}
                    </div>
                </div>
                ${accessRow}
                ${terrainRow}
                ${infraRow}
            </div>

            <button class="btn-contact" data-id="${escapeHTML(data.id)}">Connect / Book</button>
        </div>
    `;
}

function renderCards(filterCategory = "all") {
    if (!grid) return;
    grid.innerHTML = "";

    // The data.js only holds 'experience' sites now (tools are hardcoded in index.html above the grid).
    const filteredData = filterCategory === "all"
        ? madaarSites
        : madaarSites.filter(item => item.category === filterCategory);

    if (filteredData.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--sand-dust);">No experiences found for this category.</p>`;
        return;
    }

    grid.innerHTML = filteredData.map(item => createCard(item)).join("");

    // Wire up connect buttons
    document.querySelectorAll(".btn-contact").forEach(button => {
        button.addEventListener("click", () => {
            alert(`Demo: Connection request / booking initiated!`);
        });
    });
}

function buildFilters() {
    if (!filterControls) return;
    
    // Add 'All' button
    let html = `<button class="filter-btn active" data-filter="all">All Experiences</button>`;
    
    // Generate buttons for categories that belong in the 'experience' group
    for (const [catName, config] of Object.entries(CATEGORIES)) {
        if (config.group === "experience") {
            html += `<button class="filter-btn" data-filter="${escapeHTML(catName)}">${config.icon} ${escapeHTML(catName)}</button>`;
        } else if (config.group === "tool") {
            // Tools scroll the user up to the feature panel instead of filtering the grid
            html += `<button class="filter-btn tool-link" data-tool="${escapeHTML(catName)}">${config.icon} ${escapeHTML(catName)}</button>`;
        }
    }
    
    filterControls.innerHTML = html;

    // Attach listeners
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const btnEl = e.currentTarget;
            
            // If it's a tool link, just scroll to the panel, don't change active state of grid filters
            if (btnEl.classList.contains('tool-link')) {
                document.getElementById('madaar-feature-panel').scrollIntoView({ behavior: 'smooth' });
                return;
            }

            // Standard grid filter
            document.querySelectorAll(".filter-btn:not(.tool-link)").forEach(b => b.classList.remove("active"));
            btnEl.classList.add("active");

            const category = btnEl.getAttribute("data-filter");
            renderCards(category);
        });
    });
}

// ----------------------------
// Initialization
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
    // 1. Init Moon Tracker (from moon.js)
    initMoonPanel();
    
    // 2. Init Ask a Local Events
    const askBtn = document.getElementById("ask-local-btn");
    if (askBtn) askBtn.addEventListener("click", () => showLocalAnswer());

    document.querySelectorAll(".ask-chip").forEach(button => {
        button.addEventListener("click", () => {
            const question = button.getAttribute("data-question");
            const input = document.getElementById("local-question");
            if (input) input.value = question;
            showLocalAnswer(question);
        });
    });

    // 3. Build UI and render cards
    buildFilters();
    renderCards("all");
});