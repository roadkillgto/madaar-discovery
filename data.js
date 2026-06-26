// ----------------------------------------------------------------------------
// data.js — every listing and every "Ask a Local" answer lives here, and
// ONLY here. This is the file your team edits to add a new site or tour —
// no other file needs to change for that.
//
// Each site has an overall `civilScore` plus three sub-ratings (access,
// terrain, infrastructure), each 0–100. The sub-ratings are a structured
// version of the same judgment call already implied by the original
// descriptive text — kept here as numbers so the UI can render an honest
// "instrument reading" per site instead of just prose.
// ----------------------------------------------------------------------------

export const madaarSites = [
    {
        id: "site_01",
        category: "Astrotourism",
        name: "Dark Sky Camp — Plot Alpha",
        provider: "Al Mansouri Camel Farm",
        description: "Overnight stargazing plot away from town lights. Includes traditional majlis seating and fresh camel milk in the morning.",
        civilScore: 88,
        engineering: {
            access: { rating: 65, note: "Moderate — 3km unpaved, compacted sand." },
            terrain: { rating: 90, note: "Flat, natural windbreak from dunes." },
            infrastructure: { rating: 80, note: "Solar red-spectrum lighting to reduce light pollution. Minimal grading required." }
        }
    },
    {
        id: "site_02",
        category: "Farm Tours",
        name: "Sunrise Camel Husbandry Tour",
        provider: "Oasis Heritage Farms",
        description: "Learn how a working camel farm operates. Good for families, students, and visitors interested in local heritage.",
        civilScore: 95,
        engineering: {
            access: { rating: 95, note: "High — direct access from paved utility road." },
            terrain: { rating: 95, note: "Fully graded existing farm footprint." },
            infrastructure: { rating: 80, note: "Requires dedicated visitor parking, separate from farm equipment." }
        }
    },
    {
        id: "site_03",
        category: "Safety Check-in",
        name: "Non-Emergency 4x4 Sand Recovery Guidance",
        provider: "Al Qua'a Local Assistance Network",
        description: "Guidance for visitors who may get stuck in sand near stargazing areas. This is not an emergency service and does not replace official emergency numbers.",
        civilScore: 92,
        engineering: {
            access: { rating: 90, note: "Mobile guidance based on shared WhatsApp location." },
            terrain: { rating: 50, note: "Serves desert routes and soft sand zones — the terrain itself is the challenge." },
            infrastructure: { rating: 95, note: "Runs on GPS location sharing and WhatsApp — no physical build needed." }
        }
    },
    {
        id: "site_04",
        category: "Astrotourism",
        name: "Meteor Shower Observation Deck",
        provider: "Dune Crest Cooperative",
        description: "Temporary elevated viewing area for meteor shower nights. Designed for visitors who want a darker, more open sky view.",
        civilScore: 75,
        engineering: {
            access: { rating: 35, note: "Low — deep sand, 4x4 required." },
            terrain: { rating: 55, note: "Elevated dune crest, needs temporary matting for stability." },
            infrastructure: { rating: 60, note: "Needs temporary wind fencing and portable waste collection. No permanent footprint." }
        }
    },
    {
        id: "site_05",
        category: "Community Board",
        name: "Dark Sky Protocol: Meteor Shower Night",
        provider: "Al Qua'a Farmers Cooperative",
        description: "Community reminder for participating farms to reduce non-essential lighting during major stargazing events.",
        civilScore: 98,
        engineering: {
            access: { rating: 100, note: "Area-wide community protocol — no physical access barrier." },
            terrain: { rating: 100, note: "Affects a wide radius of cooperating farms." },
            infrastructure: { rating: 95, note: "Requires manual reduction of non-essential farm perimeter lighting." }
        }
    }
];

export const localGuidance = [
    {
        keywords: ["time", "arrive", "arrival", "sunset", "when"],
        question: "What is the best time to arrive?",
        answer: "Arrive 30 to 45 minutes before sunset. That gives you time to find the location safely, park properly, meet the host, and settle in before the sky gets dark."
    },
    {
        keywords: ["bring", "carry", "need", "items", "pack"],
        question: "What should I bring?",
        answer: "Water, a charged phone, warm clothing for late night, a power bank, snacks, and a red-light torch if you have one. Avoid bright white lights — they reduce night vision for everyone nearby."
    },
    {
        keywords: ["car", "4x4", "vehicle", "drive", "road"],
        question: "Do I need a 4x4?",
        answer: "Some sites are reachable by normal car. Deeper desert sites may require a 4x4 — check the access reading on the listing and confirm with the host before visiting."
    },
    {
        keywords: ["farm", "camel", "animal", "rules"],
        question: "What farm rules should I follow?",
        answer: "Don't enter animal areas without the host. Stay in the visitor zone, keep children supervised, avoid loud noise near animals, and follow the farm owner's instructions."
    },
    {
        keywords: ["light", "dark", "torch", "headlights"],
        question: "How do I protect the dark sky?",
        answer: "Use low lighting or red light where possible. Turn off unnecessary headlights, avoid floodlights, and keep phone brightness low during stargazing."
    },
    {
        keywords: ["family", "kids", "children"],
        question: "Is it family friendly?",
        answer: "Some experiences are family friendly, especially farm tours and hosted stargazing nights. Check the access reading and any safety notes before booking."
    },
    {
        keywords: ["weather", "wind", "sand"],
        question: "What weather should I check?",
        answer: "Check wind, dust, and visibility before going. Strong wind or dusty conditions can make stargazing less comfortable and reduce visibility."
    }
];
