// Pet shop data
const shopPets = [
    { id: 1, name: "Fluffy Cat ", cost: 100, image: "row-1-column-1.png" },
    { id: 2, name: "Happy Dog ", cost: 150, image: "row-1-column-2.png" },
    { id: 3, name: "Cute Rabbit ", cost: 80, image: "row-2-column-1.png" },
    { id: 4, name: "Playful Hamster ", cost: 60, image: "row-2-column-2.png" },
    { id: 5, name: "Colorful Parrot ", cost: 200, image: "row-3-column-1.png" },
    { id: 6, name: "Friendly Fish ", cost: 50, image: "row-3-column-2.png" },
    { id: 7, name: "Lazy Turtle ", cost: 120, image: "row-4-column-1.png" },
    { id: 8, name: "Energetic Guinea Pig ", cost: 90, image: "row-4-column-2.png" },
    { id: 9, name: "Calm Deer ", cost: 180, image: "pet_0.png" },
    { id: 10, name: "Playful Monkey ", cost: 140, image: "pet_1.png" },
    { id: 11, name: "Cute Panda ", cost: 250, image: "pet_2.png" },
    { id: 12, name: "Playful Panda ", cost: 220, image: "pet_3.png" },
    { id: 13, name: "Cute Panda ", cost: 250, image: "pet_4.png" },
    { id: 14, name: "Playful Panda ", cost: 220, image: "pet_5.png" }
];

let userData = {
    coins: 0,
    currentPets: [],
    ownedPets: []
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadUserData(); // This will call renderShopPets() after loading data
});

// Load user data from API
async function loadUserData() {
    try {
        // Get user ID from URL or localStorage
        const userId = getUserId();
        if (!userId) {
            showMessage('Please log in first', 'error');
            return;
        }

        // Use the same MockAPI as profile page
        const usersApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users';
        const response = await fetch(`${usersApi}/${userId}`);
        if (response.ok) {
            const user = await response.json();
            userData = {
                coins: user.coins || 0,
                currentPets: user.currentPets || [],
                ownedPets: user.ownedPets || []
            };
            renderCurrentPets();
            renderShopPets(); // Render shop pets after loading data
            updateCoinsDisplay();
            console.log('Loaded user data:', userData);
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        // Use demo data for development if API fails
        userData = {
            coins: 500,
            currentPets: [1, 3],
            ownedPets: [1, 3]
        };
        renderCurrentPets();
        renderShopPets(); // Render shop pets with demo data
        updateCoinsDisplay();
        showMessage('Using demo data - API connection failed', 'error');
    }
}

// Get user ID (implement based on your auth system)
function getUserId() {
    // This should return the current user's ID
    return localStorage.getItem('userId') || 'demo-user';
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            switchTab(tabName);
        });
    });
}

// Switch between tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Render current pets
function renderCurrentPets() {
    const currentPetsGrid = document.getElementById('currentPetsGrid');
    const noPetsMessage = document.getElementById('noPetsMessage');
    
    currentPetsGrid.innerHTML = '';

    if (userData.currentPets.length === 0) {
        noPetsMessage.style.display = 'block';
        return;
    }

    noPetsMessage.style.display = 'none';

    userData.currentPets.forEach(petId => {
        const pet = shopPets.find(p => p.id === petId);
        if (pet) {
            const petCard = createCurrentPetCard(pet);
            currentPetsGrid.appendChild(petCard);
        }
    });
}

// Create current pet card
function createCurrentPetCard(pet) {
    const card = document.createElement('div');
    card.className = 'pet-card current-pet';
    
    const imageUrl = `../../../../data/image/pets/${pet.image}`;

    card.innerHTML = `
        <div class="pet-image">
            <img src="${imageUrl}" alt="${pet.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
        </div>
        <div class="pet-info">
            <h3 class="pet-name">${pet.name}</h3>
            <div class="pet-status">Active </div>
        </div>
        <div class="pet-actions">
            <button class="remove-btn" onclick="removePet(${pet.id})">Remove</button>
        </div>
    `;

    return card;
}

// Render shop pets
function renderShopPets() {
    const shopGrid = document.getElementById('shopPetsGrid');
    shopGrid.innerHTML = '';

    shopPets.forEach(pet => {
        const petCard = createShopPetCard(pet);
        shopGrid.appendChild(petCard);
    });
}

// Create shop pet card
function createShopPetCard(pet) {
    const card = document.createElement('div');
    card.className = 'pet-card shop-pet';
    
    const isOwned = userData.ownedPets.includes(pet.id);
    const canAfford = userData.coins >= pet.cost;
    
    const imageUrl = `../../../../data/image/pets/${pet.image}`;

    card.innerHTML = `
        <div class="pet-image">
            <img src="${imageUrl}" alt="${pet.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
        </div>
        <div class="pet-info">
            <h3 class="pet-name">${pet.name}</h3>
            <p class="pet-cost"> ${pet.cost} coins</p>
        </div>
        <div class="pet-actions">
            ${isOwned ? 
                '<button class="owned-btn" disabled>Owned </button>' : 
                (canAfford ? 
                    `<button class="buy-btn" onclick="buyPet(${pet.id})">Buy </button>` :
                    `<button class="cant-afford-btn" disabled>Need ${pet.cost - userData.coins} more coins</button>`
                )
            }
        </div>
    `;

    return card;
}

// Buy a pet
async function buyPet(petId) {
    const pet = shopPets.find(p => p.id === petId);
    if (!pet) return;

    if (userData.coins < pet.cost) {
        showMessage('Not enough coins! ', 'error');
        return;
    }

    if (userData.ownedPets.includes(petId)) {
        showMessage('You already own this pet! ', 'error');
        return;
    }

    try {
        showMessage('Buying pet...', 'loading');

        // Update local data
        userData.coins -= pet.cost;
        userData.ownedPets.push(petId);
        userData.currentPets.push(petId);

        // Save to API
        await saveUserData();
        
        // Update UI
        updateCoinsDisplay();
        renderCurrentPets();
        renderShopPets();
        
        showMessage(`Successfully adopted ${pet.name}! `, 'success');
        
    } catch (error) {
        console.error('Error buying pet:', error);
        showMessage('Failed to buy pet. Please try again.', 'error');
    }
}

// Remove a pet from current pets
async function removePet(petId) {
    try {
        showMessage('Removing pet...', 'loading');

        // Update local data
        userData.currentPets = userData.currentPets.filter(id => id !== petId);

        // Save to API
        await saveUserData();
        
        // Update UI
        renderCurrentPets();
        
        showMessage('Pet removed from active pets', 'success');
        
    } catch (error) {
        console.error('Error removing pet:', error);
        showMessage('Failed to remove pet. Please try again.', 'error');
    }
}

// Save user data to API
async function saveUserData() {
    const userId = getUserId();
    const usersApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users';
    
    // First get current user data to preserve other fields
    const getCurrentUser = await fetch(`${usersApi}/${userId}`);
    if (!getCurrentUser.ok) {
        throw new Error('User not found');
    }
    
    const currentUser = await getCurrentUser.json();
    
    // Update with new pet data while preserving other fields
    const response = await fetch(`${usersApi}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            coins: userData.coins,
            currentPets: userData.currentPets,
            ownedPets: userData.ownedPets,
            // Preserve existing data
            streak: currentUser.streak || 0,
            sourcesId: currentUser.sourcesId || [],
            avatar: currentUser.avatar || ''
        })
    });

    if (!response.ok) {
        throw new Error('Failed to save user data');
    }
    
    console.log('User data saved successfully');
}

// Update coins display
function updateCoinsDisplay() {
    const coinsElement = document.getElementById('userCoins');
    coinsElement.textContent = userData.coins;
}

// Show message to user
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    
    // Clear message after 3 seconds if it's success or error
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 3000);
    }
}

// Function to add coins (call this when user completes learning activities)
function addCoins(amount, reason = 'Learning') {
    userData.coins += amount;
    updateCoinsDisplay();
    saveUserData();
    showMessage(`+${amount} coins for ${reason}! `, 'success');
}