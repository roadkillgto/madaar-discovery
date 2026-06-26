// Mada'ar App Data + Logic
// Updated with:
// 1. Moon Cycle Tracker
// 2. Ask a Local
// 3. Safer "Safety Check-in" instead of "Emergency Services"

// ----------------------------
// Data Engine
// ----------------------------

const madaarData = [
    {
        id: "site_01",
        category: "Astrotourism",
        name: "Dark Sky Camp - Plot Alpha",
        provider: "Al Mansouri Camel Farm",
        description: "Overnight stargazing plot away from town lights. Includes traditional majlis seating and fresh camel milk in the morning.",
        civil_score: 88,
        engineering: {
            access: "Moderate - 3km unpaved, compacted sand.",
            terrain: "Flat, natural windbreak from dunes.",
            infrastructure: "Solar red-spectrum lighting to reduce light pollution. Minimal grading required."
        }
    },
    {
        id: "site_02",
        category: "Farm Tours",
        name: "Sunrise Camel Husbandry Tour",
        provider: "Oasis Heritage Farms",
        description: "Learn how a working camel farm operates. Good for families, students, and visitors interested in local heritage.",
        civil_score: 95,
        engineering: {
            access: "High - Direct access from paved utility road.",
            terrain: "Fully graded existing farm footprint.",
            infrastructure: "Requires dedicated visitor parking base to separate tourists from farm equipment."
        }
    },
    {
        id: "site_03",
        category: "Safety Check-in",
        name: "Non-Emergency 4x4 Sand Recovery Guidance",
        provider: "Al Qua'a Local Assistance Network",
        description: "Guidance for visitors who may get stuck in sand near stargazing areas. This is not an emergency service and does not replace official emergency numbers.",
        civil_score: 92,
        engineering: {
            access: "Mobile guidance based on shared WhatsApp location.",
            terrain: "Designed for desert routes, soft sand zones, and unpaved access roads.",
            infrastructure: "Uses GPS location sharing, WhatsApp communication, and local route knowledge."
        }
    },
    {
        id: "site_04",
        category: "Astrotourism",
        name: "Meteor Shower Observation Deck",
        provider: "Dune Crest Cooperative",
        description: "Temporary elevated viewing area for meteor shower nights. Designed for visitors who want a darker, more open sky view.",
        civil_score: 75,
        engineering: {
            access: "Low - Deep sand, 4x4 required.",
            terrain: "Elevated dune crest, requires temporary matting for stability.",
            infrastructure: "Needs temporary wind fencing and portable waste collection. No permanent footprint."
        }
    },
    {
        id: "site_05",
        category: "Community Board",
        name: "Dark Sky Protocol: Meteor Shower Night",
        provider: "Al Qua'a Farmers Cooperative",
        description: "Community reminder for participating farms to reduce non-essential lighting during major stargazing events.",
        civil_score: 98,
        engineering: {
            access: "N/A - Area-wide community protocol.",
            terrain: "Affects a wide radius of cooperating farms.",
            infrastructure: "Requires manual reduction of non-essential farm perimeter lighting."
        }
    },
    {
        id: "tool_01",
        category: "Planning Tools",
        name: "Moon Cycle Tracker",
        provider: "Mada'ar Stargazing Planner",
        description: "Helps visitors check moon phase and moon illumination percentage to choose the best night for stargazing.",
        civil_score: 90,
        engineering: {
            access: "Digital planning tool available before the trip.",
            terrain: "Supports better timing decisions before entering rural desert routes.",
            infrastructure: "Uses date-based moon illumination calculation for prototype planning."
        }
    },
    {
        id: "tool_02",
        category: "Local Guidance",
        name: "Ask a Local",
        provider: "Al Qua'a Community Helpers",
        description: "Visitors can learn basic local advice about the area, what to bring, farm rules, best arrival time, and safe visiting behavior.",
        civil_score: 94,
        engineering: {
            access: "WhatsApp-first communication, simple FAQ, and helper-based answers.",
            terrain: "Supports visitors before entering unfamiliar rural or desert areas.",
            infrastructure: "Can be managed by local youth, community volunteers, or farm hosts."
        }
    }
];

// ----------------------------
// Ask a Local Data
// ----------------------------

const localGuidance = [
    {
        keywords: ["time", "arrive", "arrival", "sunset", "when"],
        question: "What is the best time to arrive?",
        answer: "Local tip: Arrive 30 to 45 minutes before sunset. This gives you time to find the location safely, park properly, meet the host, and prepare before the sky gets dark."
    },
    {
        keywords: ["bring", "carry", "need", "items", "pack"],
        question: "What should I bring?",
        answer: "Bring water, a charged phone, warm clothing for late night, a power bank, snacks, and a red-light torch if available. Avoid bright white lights because they reduce night vision."
    },
    {
        keywords: ["car", "4x4", "vehicle", "drive", "road"],
        question: "Do I need a 4x4?",
        answer: "Some sites are reachable by normal car, but deeper desert sites may require a 4x4. Always check the access notes in the listing and confirm with the host before visiting."
    },
    {
        keywords: ["farm", "camel", "animal", "rules"],
        question: "What farm rules should I follow?",
        answer: "Do not enter animal areas without the host. Stay in the visitor zone, keep children supervised, avoid loud noise near animals, and follow the farm owner's instructions."
    },
    {
        keywords: ["light", "dark", "torch", "headlights"],
        question: "How do I protect the dark sky?",
        answer: "Use low lighting or red lights when possible. Turn off unnecessary car headlights, avoid floodlights, and keep phone brightness low during stargazing."
    },
    {
        keywords: ["family", "kids", "children"],
        question: "Is it family friendly?",
        answer: "Some experiences are family friendly, especially farm tours and hosted stargazing nights. Check capacity, safety notes, and whether the site has easy access before booking."
    },
    {
        keywords: ["weather", "wind", "sand"],
        question: "What weather should I check?",
        answer: "Check wind, dust, and visibility before going. Strong wind or dusty conditions can make stargazing less comfortable and may reduce visibility."
    }
];

// ----------------------------
// DOM Elements
// ----------------------------

const grid = document.getElementById("hub-grid");
const filterBtns = document.querySelectorAll(".filter-btn");

// ----------------------------
// Utility Functions
// ----------------------------

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getButtonLabel(item) {
    if (item.category === "Planning Tools") return "Open Moon Tracker";
    if (item.category === "Local Guidance") return "Ask a Local";
    if (item.category === "Safety Check-in") return "View Safety Guidance";
    return "Connect / Book";
}

// ----------------------------
// Moon Cycle Tracker
// ----------------------------

function getMoonInfo(dateInput) {
    const date = new Date(dateInput);

    // Approximate lunar calculation for prototype use.
    // Reference new moon: Jan 6, 2000, 18:14 UTC.
    const synodicMonth = 29.53058867;
    const referenceNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
    const msPerDay = 1000 * 60 * 60 * 24;

    let daysSinceReference = (date.getTime() - referenceNewMoon) / msPerDay;
    let moonAge = daysSinceReference % synodicMonth;

    if (moonAge < 0) {
        moonAge += synodicMonth;
    }

    const illumination = ((1 - Math.cos((2 * Math.PI * moonAge) / synodicMonth)) / 2) * 100;
    const roundedIllumination = Math.round(illumination);

    let phase = "New Moon";

    if (moonAge < 1.85) phase = "New Moon";
    else if (moonAge < 5.54) phase = "Waxing Crescent";
    else if (moonAge < 9.23) phase = "First Quarter";
    else if (moonAge < 12.92) phase = "Waxing Gibbous";
    else if (moonAge < 16.61) phase = "Full Moon";
    else if (moonAge < 20.30) phase = "Waning Gibbous";
    else if (moonAge < 23.99) phase = "Last Quarter";
    else if (moonAge < 27.68) phase = "Waning Crescent";
    else phase = "New Moon";

    let quality = "";
    let advice = "";

    if (roundedIllumination <= 20) {
        quality = "Excellent";
        advice = "Very dark skies. This is one of the best times to visit for stargazing.";
    } else if (roundedIllumination <= 50) {
        quality = "Good";
        advice = "Good stargazing conditions, especially after the moon sets or away from direct moonlight.";
    } else if (roundedIllumination <= 75) {
        quality = "Fair";
        advice = "Some stars will still be visible, but moonlight may reduce the deep-sky experience.";
    } else {
        quality = "Not ideal";
        advice = "The moon is bright. Choose a lower illumination night for the best stargazing experience.";
    }

    return {
        phase,
        illumination: roundedIllumination,
        quality,
        advice
    };
}

function formatDate(date) {
    return date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short"
    });
}

function findBestUpcomingDates(startDate) {
    const bestDates = [];

    for (let i = 0; i < 30; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(checkDate.getDate() + i);

        const info = getMoonInfo(checkDate);

        if (info.illumination <= 20) {
            bestDates.push(`${formatDate(checkDate)} — ${info.illumination}% illuminated`);
        }

        if (bestDates.length === 4) break;
    }

    return bestDates;
}

function updateMoonTracker() {
    const dateInput = document.getElementById("visit-date");
    const moonPhase = document.getElementById("moon-phase");
    const moonIllumination = document.getElementById("moon-illumination");
    const stargazingQuality = document.getElementById("stargazing-quality");
    const moonAdvice = document.getElementById("moon-advice");
    const bestDatesList = document.getElementById("best-dates-list");

    if (!dateInput || !moonPhase || !moonIllumination || !stargazingQuality || !moonAdvice || !bestDatesList) {
        return;
    }

    const selectedDate = dateInput.value ? new Date(dateInput.value) : new Date();
    const moonInfo = getMoonInfo(selectedDate);

    moonPhase.textContent = moonInfo.phase;
    moonIllumination.textContent = `${moonInfo.illumination}%`;
    stargazingQuality.textContent = moonInfo.quality;
    moonAdvice.textContent = moonInfo.advice;

    const bestDates = findBestUpcomingDates(selectedDate);

    if (bestDates.length === 0) {
        bestDatesList.innerHTML = "<li>No very dark nights found in the next 30 days. Try checking the following month.</li>";
    } else {
        bestDatesList.innerHTML = bestDates.map(date => `<li>${escapeHTML(date)}</li>`).join("");
    }
}

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
        output.innerHTML = "Type a question or choose one of the quick questions below.";
        return;
    }

    output.innerHTML = `
        <strong>Question:</strong> ${escapeHTML(finalQuestion)}<br>
        <strong>Local answer:</strong> ${escapeHTML(getLocalAnswer(finalQuestion))}
    `;
}

// ----------------------------
// Feature Sections
// ----------------------------

function injectMadaarStyles() {
    const style = document.createElement("style");

    style.textContent = `
        .feature-panel {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 18px;
            margin: 24px 0;
        }

        .feature-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 18px;
            border: 1px solid #e5e5e5;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .feature-card h2 {
            margin-top: 0;
            margin-bottom: 8px;
        }

        .moon-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin: 14px 0;
        }

        .moon-metric {
            background: #f7f7f7;
            border-radius: 12px;
            padding: 12px;
            text-align: center;
        }

        .moon-metric span {
            display: block;
            font-size: 0.8rem;
            opacity: 0.75;
            margin-bottom: 4px;
        }

        .moon-metric strong {
            font-size: 1.1rem;
        }

        #visit-date,
        #local-question {
            width: 100%;
            padding: 10px;
            border-radius: 10px;
            border: 1px solid #ccc;
            margin: 8px 0;
        }

        .mini-btn,
        .ask-chip {
            border: none;
            border-radius: 10px;
            padding: 10px 12px;
            cursor: pointer;
            margin: 4px 4px 4px 0;
            background: #111;
            color: #fff;
        }

        .ask-chip {
            background: #f0f0f0;
            color: #111;
        }

        .answer-box {
            margin-top: 12px;
            background: #f7f7f7;
            border-radius: 12px;
            padding: 12px;
            line-height: 1.5;
        }

        .best-dates {
            margin-top: 10px;
            padding-left: 20px;
        }

        .safety-note {
            font-size: 0.9rem;
            background: #fff6e5;
            padding: 10px;
            border-radius: 10px;
            margin-top: 10px;
        }
    `;

    document.head.appendChild(style);
}

function injectFeatureSections() {
    if (!grid) return;

    const existingPanel = document.getElementById("madaar-feature-panel");
    if (existingPanel) return;

    const section = document.createElement("section");
    section.id = "madaar-feature-panel";
    section.className = "feature-panel";

    section.innerHTML = `
        <div class="feature-card" id="moon-tracker-card">
            <h2>Moon Cycle Tracker</h2>
            <p>Choose a date to check moon illumination and see whether it is good for stargazing.</p>

            <label for="visit-date"><strong>Planned visit date:</strong></label>
            <input type="date" id="visit-date">

            <div class="moon-grid">
                <div class="moon-metric">
                    <span>Moon Phase</span>
                    <strong id="moon-phase">-</strong>
                </div>
                <div class="moon-metric">
                    <span>Illumination</span>
                    <strong id="moon-illumination">-</strong>
                </div>
                <div class="moon-metric">
                    <span>Quality</span>
                    <strong id="stargazing-quality">-</strong>
                </div>
            </div>

            <p id="moon-advice"></p>

            <strong>Upcoming darker nights:</strong>
            <ul id="best-dates-list" class="best-dates"></ul>
        </div>

        <div class="feature-card" id="ask-local-card">
            <h2>Ask a Local</h2>
            <p>Learn simple local tips about Al Qua'a before visiting.</p>

            <input 
                type="text" 
                id="local-question" 
                placeholder="Example: Do I need a 4x4?"
            >

            <button class="mini-btn" id="ask-local-btn">Ask</button>

            <div>
                <button class="ask-chip" data-question="What is the best time to arrive?">Best arrival time</button>
                <button class="ask-chip" data-question="What should I bring?">What to bring</button>
                <button class="ask-chip" data-question="Do I need a 4x4?">Need a 4x4?</button>
                <button class="ask-chip" data-question="How do I protect the dark sky?">Dark-sky rules</button>
                <button class="ask-chip" data-question="What farm rules should I follow?">Farm rules</button>
            </div>

            <div class="answer-box" id="local-answer">
                Type a question or choose a quick question.
            </div>

            <div class="safety-note">
                Ask a Local is for general visitor guidance only. For emergencies, visitors must contact official emergency services.
            </div>
        </div>
    `;

    grid.parentNode.insertBefore(section, grid);

    const dateInput = document.getElementById("visit-date");
    if (dateInput) {
        const today = new Date();
        dateInput.valueAsDate = today;
        dateInput.addEventListener("change", updateMoonTracker);
    }

    const askBtn = document.getElementById("ask-local-btn");
    if (askBtn) {
        askBtn.addEventListener("click", () => showLocalAnswer());
    }

    document.querySelectorAll(".ask-chip").forEach(button => {
        button.addEventListener("click", () => {
            const question = button.getAttribute("data-question");
            const input = document.getElementById("local-question");

            if (input) input.value = question;

            showLocalAnswer(question);
        });
    });

    updateMoonTracker();
}

// ----------------------------
// Card Rendering
// ----------------------------

function createCard(data) {
    return `
        <div class="card">
            <h3>${escapeHTML(data.name)}</h3>
            <span class="tag">${escapeHTML(data.category)}</span>

            <p><strong>By:</strong> ${escapeHTML(data.provider)}</p>
            <p style="margin-top:10px;">${escapeHTML(data.description)}</p>

            <div class="engineering-box">
                <h4>Civil Engineering Feasibility</h4>
                <p><strong>Score:</strong> <span class="score">${escapeHTML(data.civil_score)}/100</span></p>
                <p><strong>Access:</strong> ${escapeHTML(data.engineering.access)}</p>
                <p><strong>Terrain:</strong> ${escapeHTML(data.engineering.terrain)}</p>
                <p><strong>Infrastructure:</strong> ${escapeHTML(data.engineering.infrastructure)}</p>
            </div>

            <button class="btn-contact" data-id="${escapeHTML(data.id)}">
                ${escapeHTML(getButtonLabel(data))}
            </button>
        </div>
    `;
}

function handleCardAction(item) {
    if (!item) return;

    if (item.category === "Planning Tools") {
        document.getElementById("moon-tracker-card")?.scrollIntoView({ behavior: "smooth" });
        return;
    }

    if (item.category === "Local Guidance") {
        document.getElementById("ask-local-card")?.scrollIntoView({ behavior: "smooth" });
        const input = document.getElementById("local-question");
        if (input) input.focus();
        return;
    }

    if (item.category === "Safety Check-in") {
        alert(
            "Safety Check-in is for non-emergency guidance only. For emergencies, contact official UAE emergency services. Demo: safety guidance opened."
        );
        return;
    }

    alert(`Demo: WhatsApp/contact request sent to ${item.provider}!`);
}

function renderCards(filterCategory = "all") {
    if (!grid) return;

    grid.innerHTML = "";

    const filteredData = filterCategory === "all"
        ? madaarData
        : madaarData.filter(item => item.category === filterCategory);

    if (filteredData.length === 0) {
        grid.innerHTML = `<p>No listings found for this category.</p>`;
        return;
    }

    grid.innerHTML = filteredData.map(item => createCard(item)).join("");

    document.querySelectorAll(".btn-contact").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id");
            const selectedItem = madaarData.find(item => item.id === id);
            handleCardAction(selectedItem);
        });
    });
}

// ----------------------------
// Filter Buttons
// ----------------------------

filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        filterBtns.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");

        const category = e.target.getAttribute("data-filter");
        renderCards(category);
    });
});

// ----------------------------
// Initialize App
// ----------------------------

injectMadaarStyles();
injectFeatureSections();
renderCards("all");
