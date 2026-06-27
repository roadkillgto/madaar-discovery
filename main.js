import { CATEGORIES, ROAD_TYPES } from "./config.js";
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
    const roadLabel = data.roadType ? ROAD_TYPES[data.roadType] : null;
    
    return `
        <div class="card">
            <h3>${escapeHTML(data.name)}</h3>
            <div class="tag-row"><span class="tag">${icon} ${escapeHTML(data.category)}</span></div>
            ${roadLabel ? `<div class="tag-row"><span class="tag road-tag" data-road="${escapeHTML(data.roadType)}">🚙 ${escapeHTML(roadLabel)}</span></div>` : ""}
            <p class="provider"><strong>By:</strong> ${escapeHTML(data.provider)}</p>
            <p class="description">${escapeHTML(data.description)}</p>
            ${data.capacity ? `<p class="provider"><strong>Capacity:</strong> ${escapeHTML(data.capacity)}</p>` : ""}
            <div class="status-box">
                <span class="status-indicator"></span> 
                ${escapeHTML(data.status)}
            </div>
            ${data.contactLink === "community-board"
                ? `<button class="btn-contact action-btn" data-link="community-board">📋 View Protocol</button>
   <div class="community-notice" style="display:none; margin-top:16px; padding:16px; background:rgba(232,160,85,0.1); border-left:3px solid var(--accent-primary); border-radius:0 8px 8px 0; font-size:0.9rem; color:var(--text-secondary);">
       <strong style="color:var(--accent-primary); display:block; margin-bottom:8px;">Dark Sky Protocol — Active</strong>
       Participating farms: switch off non-essential perimeter lighting between 8 PM and 6 AM during designated stargazing events. Floodlights, decorative lighting, and vehicle headlights should be minimised. This protocol is voluntary and community-enforced.
   </div>`
               : `<div class="contact-row">
                    <a href="${escapeHTML(data.contactLink)}" target="_blank" class="btn-contact btn-whatsapp">📲 WhatsApp</a>
                    <a href="sms:${escapeHTML(data.phone)}" class="btn-contact btn-sms">💬 SMS</a>
                    ${data.mapLink ? `<a href="${escapeHTML(data.mapLink)}" target="_blank" class="btn-contact btn-map">📍 Map</a>` : ""}
                   </div>`
            }
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

            if (link === "community-board") {
                const notice = btn.closest('.card').querySelector('.community-notice');
                const isOpen = notice.style.display !== 'none';
                notice.style.display = isOpen ? 'none' : 'block';
                btn.textContent = isOpen ? '📋 View Protocol' : '✕ Close';
                return;
            }

            const originalText = btn.textContent;
            btn.textContent = "Connecting...";
            btn.style.backgroundColor = "var(--signal-green)";
            btn.style.color = "#000";
            btn.style.borderColor = "var(--signal-green)";
            setTimeout(() => {
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
