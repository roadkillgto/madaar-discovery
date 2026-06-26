// The Data Engine (Simulating your data.json file)
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
            infrastructure: "Solar red-spectrum lighting (zero light pollution). Minimal grading required."
        }
    },
    {
        id: "site_02",
        category: "Farm Tours",
        name: "Sunrise Camel Husbandry Tour",
        provider: "Oasis Heritage Farms",
        description: "Learn how a working camel farm operates. Great for families and international tourists visiting the Al Ain region.",
        civil_score: 95,
        engineering: {
            access: "High - Direct access from paved utility road.",
            terrain: "Fully graded existing farm footprint.",
            infrastructure: "Requires dedicated visitor parking base (10x20m gravel) to separate from farm equipment."
        }
    },
    {
        id: "site_03",
        category: "Emergency Services",
        name: "Community 4x4 Sand Recovery",
        provider: "Al Qua'a Volunteer Network",
        description: "Local off-road experts available for vehicle recovery if tourists or residents get stuck in deep sand near stargazing sites.",
        civil_score: 100,
        engineering: {
            access: "N/A - Mobile dispatch.",
            terrain: "Equipped for all dune classifications.",
            infrastructure: "Utilizes existing GPS/WhatsApp coordinates and local grid knowledge."
        }
    },
    {
        id: "site_04",
        category: "Astrotourism",
        name: "Meteor Shower Observation Deck",
        provider: "Dune Crest Cooperative",
        description: "Elevated, temporary viewing area set up specifically for the upcoming Perseid meteor shower.",
        civil_score: 75,
        engineering: {
            access: "Low - Deep sand, 4x4 required.",
            terrain: "Elevated dune crest, requires temporary matting for stability.",
            infrastructure: "Needs temporary wind fencing and portable sanitary units. No permanent footprint."
        }
    }
];

// App Logic
const grid = document.getElementById('hub-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

// Function to generate HTML for a single card
function createCard(data) {
    return `
        <div class="card">
            <h3>${data.name}</h3>
            <span class="tag">${data.category}</span>
            <p><strong>By:</strong> ${data.provider}</p>
            <p style="margin-top:10px;">${data.description}</p>
            
            <div class="engineering-box">
                <h4>📐 Civil Engineering Feasibility</h4>
                <p><strong>Score:</strong> <span class="score">${data.civil_score}/100</span></p>
                <p><strong>Access:</strong> ${data.engineering.access}</p>
                <p><strong>Terrain:</strong> ${data.engineering.terrain}</p>
                <p><strong>Infrastructure:</strong> ${data.engineering.infrastructure}</p>
            </div>
            
            <button class="btn-contact" onclick="alert('Demo: Notification sent to ${data.provider}!')">Connect / Book</button>
        </div>
    `;
}

// Function to render all cards based on a filter
function renderCards(filterCategory) {
    grid.innerHTML = ''; // Clear current cards
    
    const filteredData = filterCategory === 'all' 
        ? madaarData 
        : madaarData.filter(item => item.category === filterCategory);
        
    filteredData.forEach(item => {
        grid.innerHTML += createCard(item);
    });
}

// Event listeners for filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update active styling
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filter the grid
        const category = e.target.getAttribute('data-filter');
        renderCards(category);
    });
});

// Initial render on page load
renderCards('all');
