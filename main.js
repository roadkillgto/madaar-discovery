import { CATEGORIES } from "./config.js";
import { madaarSites, localGuidance } from "./data.js";
import { initMoonPanel } from "./moon.js";

import { escapeHTML } from "./utils.js";
// Register service worker — enables offline-first caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .catch(err => console.warn('SW registration failed:', err));
  });
}
const grid = document.getElementById("hub-grid");
const filterControls = document.getElementById("filter-controls");

// ----------------------------
// Ask a Local Logic
// ----------------------------
function getLocalAnswer(questionText) {
    const text = questionText.toLowerCase();
    const match = localGuidance.find(item => item.keywords.some(keyword => text.includes(keyword)));
    return match ? match.answer : "Local tip: Confirm your visit with the host before arriving. Ask about road access, arrival time, parking, and whether the site is suitable for families.";
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
        <div style="margin-bottom: 8px; color: var(--accent-primary);"><strong>Q: ${escapeHTML(finalQuestion)}</strong></div>
        <div style="color: var(--text-primary);">A: ${escapeHTML(getLocalAnswer(finalQuestion))}</div>
    `;
}

// ----------------------------
// Render Logic
// ----------------------------
function createCard(data) {
    const categoryConfig = CATEGORIES[data.category];
    const icon = categoryConfig ? categoryConfig.icon : "";
    
    return `
        <div class="card">
            <h3>${escapeHTML(data.name)}</h3>
            <div class="tag-row"><span class="tag">${icon} ${escapeHTML(data.category)}</span></div>
            <p class="provider"><strong>By:</strong> ${escapeHTML(data.provider)}</p>
            <p class="description">${escapeHTML(data.description)}</p>

            <div class="status-box">
                <span class="status-indicator"></span> 
                ${escapeHTML(data.status)}
            </div>

            <button class="btn-contact action-btn" data-link="${escapeHTML(data.contactLink)}">Connect via Network</button>
        </div>
    `;
}

function renderCards(filterCategory = "all") {
    if (!grid) return;
    grid.innerHTML = "";

    const filteredData = filterCategory === "all"
        ? madaarSites
        : madaarSites.filter(item => item.category === filterCategory);

    if (filteredData.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No community listings found.</p>`;
        return;
    }

    grid.innerHTML = filteredData.map(item => createCard(item)).join("");

    // Modern Button Interaction Logic
    document.querySelectorAll(".action-btn").forEach(button => {
        button.addEventListener("click", (e) => {
            const btn = e.currentTarget;
            const link = btn.getAttribute("data-link");
            
            // Visual feedback: Change button to green and update text
            const originalText = btn.textContent;
            btn.textContent = "Opening Secure Connection...";
            btn.style.backgroundColor = "var(--signal-green)";
            btn.style.color = "#000";
            btn.style.borderColor = "var(--signal-green)";

            // Simulate a brief loading state before the action
            setTimeout(() => {
                if(link === "community-board") {
                    alert("Demo: Routing to Community Board specific page.");
                } else {
                    alert(`Demo: In a live app, this opens WhatsApp routing to: ${link}`);
                }
                
                // Reset button state
                btn.textContent = originalText;
                btn.style.backgroundColor = "";
                btn.style.color = "";
                btn.style.borderColor = "";
            }, 800);
        });
    });
}

function buildFilters() {
    if (!filterControls) return;
    let html = `<button class="filter-btn active" data-filter="all">All Experiences</button>`;
    
    for (const [catName, config] of Object.entries(CATEGORIES)) {
        if (config.group === "experience") {
            html += `<button class="filter-btn" data-filter="${escapeHTML(catName)}">${config.icon} ${escapeHTML(catName)}</button>`;
        } else if (config.group === "tool") {
            html += `<button class="filter-btn tool-link" data-tool="${escapeHTML(catName)}">${config.icon} ${escapeHTML(catName)}</button>`;
        }
    }
    filterControls.innerHTML = html;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const btnEl = e.currentTarget;
            if (btnEl.classList.contains('tool-link')) {
                document.getElementById('madaar-feature-panel').scrollIntoView({ behavior: 'smooth' });
                return;
            }
            document.querySelectorAll(".filter-btn:not(.tool-link)").forEach(b => b.classList.remove("active"));
            btnEl.classList.add("active");
            renderCards(btnEl.getAttribute("data-filter"));
        });
    });
}

// ----------------------------
// Initialization & Global Listeners
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
    initMoonPanel();
    
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

    buildFilters();
    renderCards("all");
});
