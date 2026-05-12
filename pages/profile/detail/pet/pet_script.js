// Pet shop data
const shopPets = [
    { id: 1, name: "Fluffy Cat ", cost: 100, image: "row-1-column-1.png", attack: 10, health: 100, rarity: "common" },
    { id: 2, name: "Happy Dog ", cost: 150, image: "row-1-column-2.png", attack: 15, health: 120, rarity: "common" },
    { id: 3, name: "Cute Rabbit ", cost: 80, image: "row-2-column-1.png", attack: 8, health: 80, rarity: "common" },
    { id: 4, name: "Playful Hamster ", cost: 60, image: "row-2-column-2.png", attack: 5, health: 60, rarity: "common" },
    { id: 5, name: "Colorful Parrot ", cost: 200, image: "row-3-column-1.png", attack: 20, health: 150, rarity: "rare" },
    { id: 6, name: "Friendly Fish ", cost: 50, image: "row-3-column-2.png", attack: 3, health: 50, rarity: "common" },
    { id: 7, name: "Lazy Turtle ", cost: 120, image: "row-4-column-1.png", attack: 12, health: 140, rarity: "uncommon" },
    { id: 8, name: "Energetic Guinea Pig ", cost: 90, image: "row-4-column-2.png", attack: 10, health: 90, rarity: "common" },
    { id: 9, name: "Calm Deer ", cost: 180, image: "pet_0.png", attack: 18, health: 160, rarity: "uncommon" },
    { id: 10, name: "Playful Monkey ", cost: 140, image: "pet_1.png", attack: 16, health: 130, rarity: "uncommon" },
    { id: 11, name: "Cute Panda ", cost: 250, image: "pet_2.png", attack: 25, health: 200, rarity: "epic" },
    { id: 12, name: "Playful Panda ", cost: 220, image: "pet_3.png", attack: 22, health: 180, rarity: "rare" },
    { id: 13, name: "Cute Panda ", cost: 250, image: "pet_4.png", attack: 25, health: 200, rarity: "epic" },
    { id: 14, name: "Playful Panda ", cost: 220, image: "pet_5.png", attack: 22, health: 180, rarity: "rare" }
];

let userData = {
    coins: 0,
    currentPets: [],
    ownedPets: [],
    petDetails: {} // Store detailed pet info with levels
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
                ownedPets: user.ownedPets || [],
                petDetails: user.petDetails || {}
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
    card.className = `pet-card current-pet rarity-${pet.rarity}`;
    
    const imageUrl = `../../../../data/image/pets/${pet.image}`;
    
    // Get pet details with level info
    const petDetails = userData.petDetails[pet.id] || initializePetDetails(pet);
    const level = petDetails.level;
    const exp = petDetails.exp;
    const expToNext = getExpToNextLevel(level);
    const currentHealth = pet.health + (level - 1) * 10;
    const currentAttack = pet.attack + (level - 1) * 5;
    const levelUpCost = getLevelUpCost(level);
    const canAffordLevelUp = userData.coins >= levelUpCost;

    card.innerHTML = `
        <div class="pet-image">
            <img src="${imageUrl}" alt="${pet.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            <div class="rarity-badge ${pet.rarity}">${pet.rarity.toUpperCase()}</div>
        </div>
        <div class="pet-info">
            <h3 class="pet-name">${pet.name}</h3>
            <div class="pet-level">Level ${level}</div>
            <div class="pet-stats">
                <div class="stat-item">
                    <span class="stat-label">⚔️ Attack:</span>
                    <span class="stat-value">${currentAttack}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">❤️ Health:</span>
                    <span class="stat-value">${currentHealth}</span>
                </div>
            </div>
            <div class="exp-bar">
                <div class="exp-label">EXP: ${exp}/${expToNext}</div>
                <div class="exp-progress">
                    <div class="exp-fill" style="width: ${(exp / expToNext) * 100}%"></div>
                </div>
            </div>
            <div class="pet-status">Active </div>
        </div>
        <div class="pet-actions">
            <button class="level-up-btn" onclick="levelUpPet(${pet.id})" ${!canAffordLevelUp ? 'disabled' : ''}>
                Level Up (${levelUpCost} 💰)
            </button>
        </div>
    `;

    return card;
}

// Initialize pet details when first bought
function initializePetDetails(pet) {
    const details = {
        level: 1,
        exp: 0,
        totalBattles: 0,
        wins: 0
    };
    
    userData.petDetails[pet.id] = details;
    return details;
}

// Get EXP needed for next level
function getExpToNextLevel(level) {
    return level * 100; // Level 1: 100, Level 2: 200, etc.
}

// Get coin cost for level up
function getLevelUpCost(level) {
    return level * 50; // Level 1: 50, Level 2: 100, Level 3: 150, etc.
}

// Level up pet using coins
async function levelUpPet(petId) {
    const pet = shopPets.find(p => p.id === petId);
    const petDetails = userData.petDetails[petId];
    if (!petDetails || !pet) return;
    
    const levelUpCost = getLevelUpCost(petDetails.level);
    
    if (userData.coins < levelUpCost) {
        showMessage(`Not enough coins! Need ${levelUpCost} coins`, 'error');
        return;
    }
    
    try {
        showMessage('Leveling up pet...', 'loading');
        
        // Deduct coins and level up
        userData.coins -= levelUpCost;
        petDetails.level += 1;
        
        // Update daily quest progress for pet interaction
        updatePetQuestProgress();
        
        // Save to API
        await saveUserData();
        
        // Update UI
        updateCoinsDisplay();
        renderCurrentPets();
        showMessage(`${pet.name} reached level ${petDetails.level}!`, 'success');
        
    } catch (error) {
        console.error('Error leveling up pet:', error);
        showMessage('Failed to level up pet. Please try again.', 'error');
    }
}

// Function to update pet quest progress
function updatePetQuestProgress() {
    const savedQuests = JSON.parse(localStorage.getItem('dailyQuests') || '{}');
    const questData = savedQuests['pet_interaction'] || { progress: 0, claimed: false };
    
    if (!questData.claimed) {
        questData.progress = Math.min(questData.progress + 1, 1); // Track level-ups
        savedQuests['pet_interaction'] = questData;
        localStorage.setItem('dailyQuests', JSON.stringify(savedQuests));
        
        // Show notification for quest progress
        showPetQuestNotification();
    }
}

function showPetQuestNotification() {
    const messageDiv = document.getElementById('message');
    const originalMessage = messageDiv.textContent;
    const originalClass = messageDiv.className;
    
    messageDiv.textContent = '🐾 Pet interaction quest progress!';
    messageDiv.className = 'message success';
    
    setTimeout(() => {
        messageDiv.textContent = originalMessage;
        messageDiv.className = originalClass;
    }, 2000);
}

// Add EXP to pet (call this when pet does activities)
function addExpToPet(petId, amount) {
    const petDetails = userData.petDetails[petId];
    if (!petDetails) return;
    
    petDetails.exp += amount;
    
    // Check for level up
    const expToNext = getExpToNextLevel(petDetails.level);
    while (petDetails.exp >= expToNext) {
        petDetails.exp -= expToNext;
        petDetails.level += 1;
        showMessage(`${petDetails.name} leveled up to ${petDetails.level}!`, 'success');
    }
    
    saveUserData();
    renderCurrentPets();
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
        
        // Initialize pet details for new pet
        initializePetDetails(pet);

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
            petDetails: userData.petDetails,
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

// Battle System Variables
let battleState = {
    userPets: [],
    enemyPets: [],
    currentUserPetIndex: 0,
    currentEnemyPetIndex: 0,
    currentTurn: 'user',
    isBattleActive: false,
    selectedUserPets: [],
    currentQuestion: null,
    correctAnswer: null,
    usedQuestions: [] // Track used questions to prevent duplicates
};

// Flashcard API for battle questions
const flashcardApi = "https://682dcaf54fae1889475791ed.mockapi.io/api/v2/speaklearn/word";

// ... rest of the code remains the same ...
// Initialize battle system
function initializeBattleSystem() {
    // Add battle tab event listener
    const battleTab = document.querySelector('[data-tab="battle"]');
    if (battleTab) {
        battleTab.addEventListener('click', () => {
            showPetSelection();
        });
    }

    // Setup battle event listeners
    setupBattleEventListeners();
}

function setupBattleEventListeners() {
    // Start battle button
    const startBattleBtn = document.getElementById('startBattleBtn');
    if (startBattleBtn) {
        startBattleBtn.addEventListener('click', startBattle);
    }

    // Attack button
    const attackBtn = document.getElementById('attackBtn');
    if (attackBtn) {
        attackBtn.addEventListener('click', showQuestion);
    }

    // Next Pet button
    const nextPetBtn = document.getElementById('nextPetBtn');
    if (nextPetBtn) {
        nextPetBtn.addEventListener('click', switchToNextPet);
    }

    // Flee button
    const fleeBtn = document.getElementById('fleeBtn');
    if (fleeBtn) {
        fleeBtn.addEventListener('click', fleeBattle);
    }

    // Continue button
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', resetBattle);
    }
}

// Show pet selection phase
function showPetSelection() {
    const selectionGrid = document.getElementById('battleSelectionGrid');
    const startBattleBtn = document.getElementById('startBattleBtn');
    
    if (!selectionGrid) return;
    
    selectionGrid.innerHTML = '';
    battleState.selectedUserPets = [];
    
    // Show user's pets for selection
    userData.currentPets.forEach(petId => {
        const pet = shopPets.find(p => p.id === petId);
        if (pet) {
            const petDetails = userData.petDetails[petId] || initializePetDetails(pet);
            const selectionCard = createSelectionCard(pet, petDetails);
            selectionGrid.appendChild(selectionCard);
        }
    });
    
    // Show start battle button if user has pets
    if (userData.currentPets.length > 0) {
        startBattleBtn.style.display = 'inline-block';
    }
}

// Create pet selection card
function createSelectionCard(pet, petDetails) {
    const card = document.createElement('div');
    card.className = 'selection-pet-card';
    card.dataset.petId = pet.id;
    
    const imageUrl = `../../../../data/image/pets/${pet.image}`;
    const level = petDetails.level;
    const currentAttack = pet.attack + (level - 1) * 5;
    const currentHealth = pet.health + (level - 1) * 10;
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${pet.name}" class="selection-pet-image" 
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'">
        <div class="selection-pet-name">${pet.name}</div>
        <div class="selection-pet-stats">
            Level ${level} | ATK: ${currentAttack} | HP: ${currentHealth}
        </div>
    `;
    
    card.addEventListener('click', () => togglePetSelection(card));
    
    return card;
}

// Toggle pet selection
function togglePetSelection(card) {
    const petId = parseInt(card.dataset.petId);
    const index = battleState.selectedUserPets.indexOf(petId);
    
    if (index > -1) {
        // Deselect pet
        battleState.selectedUserPets.splice(index, 1);
        card.classList.remove('selected');
    } else if (battleState.selectedUserPets.length < 3) {
        // Select pet
        battleState.selectedUserPets.push(petId);
        card.classList.add('selected');
    } else {
        showMessage('Maximum 3 pets allowed!', 'error');
        return;
    }
    
    // Update start battle button
    const startBattleBtn = document.getElementById('startBattleBtn');
    startBattleBtn.style.display = battleState.selectedUserPets.length > 0 ? 'inline-block' : 'none';
}

// Start battle
async function startBattle() {
    if (battleState.selectedUserPets.length === 0) {
        showMessage('Please select at least 1 pet!', 'error');
        return;
    }
    
    try {
        // Initialize battle state
        battleState.userPets = battleState.selectedUserPets.map(petId => {
            const pet = shopPets.find(p => p.id === petId);
            const petDetails = userData.petDetails[petId] || initializePetDetails(pet);
            return {
                ...pet,
                level: petDetails.level,
                currentHP: pet.health + (petDetails.level - 1) * 10,
                maxHP: pet.health + (petDetails.level - 1) * 10,
                currentAttack: pet.attack + (petDetails.level - 1) * 5
            };
        });
        
        // Generate random enemy pets
        battleState.enemyPets = generateRandomEnemyPets();
        
        // Reset indices and question tracking
        battleState.currentUserPetIndex = 0;
        battleState.currentEnemyPetIndex = 0;
        battleState.currentTurn = 'user';
        battleState.isBattleActive = true;
        battleState.usedQuestions = []; // Reset used questions for new battle
        
        // Switch to battle phase
        showBattlePhase();
        
        // Update battle display
        updateBattleDisplay();
        
        showMessage('Battle started! Your turn!', 'success');
        
    } catch (error) {
        console.error('Error starting battle:', error);
        showMessage('Failed to start battle', 'error');
    }
}

// Generate random enemy pets
function generateRandomEnemyPets() {
    const enemyCount = 3;
    const enemies = [];
    
    // Get average level of user pets
    const avgUserLevel = battleState.userPets.reduce((sum, pet) => sum + pet.level, 0) / battleState.userPets.length;
    
    for (let i = 0; i < enemyCount; i++) {
        const randomPet = shopPets[Math.floor(Math.random() * shopPets.length)];
        const enemyLevel = Math.max(1, Math.floor(avgUserLevel + (Math.random() - 0.5) * 3)); // ±1.5 levels
        
        enemies.push({
            ...randomPet,
            level: enemyLevel,
            currentHP: randomPet.health + (enemyLevel - 1) * 10,
            maxHP: randomPet.health + (enemyLevel - 1) * 10,
            currentAttack: randomPet.attack + (enemyLevel - 1) * 5,
            isEnemy: true
        });
    }
    
    return enemies;
}

// Show battle phase
function showBattlePhase() {
    document.getElementById('petSelectionPhase').style.display = 'none';
    document.getElementById('battlePhase').style.display = 'block';
    document.getElementById('battleResults').style.display = 'none';
}

// Update battle display
function updateBattleDisplay() {
    const userPet = battleState.userPets[battleState.currentUserPetIndex];
    const enemyPet = battleState.enemyPets[battleState.currentEnemyPetIndex];
    
    if (!userPet || !enemyPet) return;
    
    // Update user pet display
    document.getElementById('userPetImage').src = `../../../../data/image/pets/${userPet.image}`;
    document.getElementById('userPetName').textContent = userPet.name;
    document.getElementById('userCurrentHP').textContent = Math.max(0, userPet.currentHP);
    document.getElementById('userMaxHP').textContent = userPet.maxHP;
    document.getElementById('userHPFill').style.width = `${(Math.max(0, userPet.currentHP) / userPet.maxHP) * 100}%`;
    
    // Update enemy pet display
    document.getElementById('enemyPetImage').src = `../../../../data/image/pets/${enemyPet.image}`;
    document.getElementById('enemyPetName').textContent = enemyPet.name;
    document.getElementById('enemyCurrentHP').textContent = Math.max(0, enemyPet.currentHP);
    document.getElementById('enemyMaxHP').textContent = enemyPet.maxHP;
    document.getElementById('enemyHPFill').style.width = `${(Math.max(0, enemyPet.currentHP) / enemyPet.maxHP) * 100}%`;
    
    // Update turn indicator
    document.getElementById('currentTurn').textContent = battleState.currentTurn === 'user' ? 'Your Turn' : 'Enemy Turn';
    
    // Update team status
    updateTeamStatus();
    
    // Update battle buttons
    updateBattleButtons();
}

// Update team status display
function updateTeamStatus() {
    const userTeamStatus = document.getElementById('userTeamStatus');
    const enemyTeamStatus = document.getElementById('enemyTeamStatus');
    
    // Update user team status
    userTeamStatus.innerHTML = '';
    battleState.userPets.forEach((pet, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'team-pet-indicator';
        indicator.textContent = index + 1;
        
        if (index < battleState.currentUserPetIndex) {
            indicator.classList.add('defeated');
        } else if (index === battleState.currentUserPetIndex && pet.currentHP > 0) {
            indicator.classList.add('active');
        }
        
        userTeamStatus.appendChild(indicator);
    });
    
    // Update enemy team status
    enemyTeamStatus.innerHTML = '';
    battleState.enemyPets.forEach((pet, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'team-pet-indicator';
        indicator.textContent = index + 1;
        
        if (index < battleState.currentEnemyPetIndex) {
            indicator.classList.add('defeated');
        } else if (index === battleState.currentEnemyPetIndex && pet.currentHP > 0) {
            indicator.classList.add('active');
        }
        
        enemyTeamStatus.appendChild(indicator);
    });
}

// Update battle buttons
function updateBattleButtons() {
    const attackBtn = document.getElementById('attackBtn');
    const nextPetBtn = document.getElementById('nextPetBtn');
    
    if (battleState.currentTurn === 'user') {
        attackBtn.style.display = 'inline-block';
        nextPetBtn.style.display = 'none';
    } else {
        attackBtn.style.display = 'none';
        nextPetBtn.style.display = 'none';
    }
}

// Show flashcard question
async function showQuestion() {
    try {
        const response = await fetch(flashcardApi);
        const words = await response.json();
        
        if (words.length === 0) {
            showMessage('No questions available', 'error');
            return;
        }
        
        // Filter out already used questions
        const availableWords = words.filter(word => !battleState.usedQuestions.includes(word.id));
        
        if (availableWords.length === 0) {
            // If all questions have been used, reset the list
            battleState.usedQuestions = [];
            showMessage('All questions used! Resetting question pool...', 'loading');
            setTimeout(() => showQuestion(), 1000);
            return;
        }
        
        // Select random word from available questions
        const questionWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        battleState.currentQuestion = questionWord.front;
        battleState.correctAnswer = questionWord.back;
        
        // Add this question to used list
        battleState.usedQuestions.push(questionWord.id);
        
        // Generate 4 answer options (1 correct, 3 incorrect)
        const answers = [battleState.correctAnswer];
        const otherWords = words.filter(w => w.back !== battleState.correctAnswer);
        
        while (answers.length < 4 && otherWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * otherWords.length);
            const wrongAnswer = otherWords[randomIndex].back;
            if (!answers.includes(wrongAnswer)) {
                answers.push(wrongAnswer);
            }
            otherWords.splice(randomIndex, 1);
        }
        
        // Shuffle answers
        answers.sort(() => Math.random() - 0.5);
        
        // Display question
        displayQuestion(battleState.currentQuestion, answers);
        
    } catch (error) {
        console.error('Error loading question:', error);
        showMessage('Failed to load question', 'error');
    }
}

// Display question and answers
function displayQuestion(question, answers) {
    const questionPhase = document.getElementById('questionPhase');
    const questionText = document.getElementById('questionText');
    const answerOptions = document.getElementById('answerOptions');
    const attackBtn = document.getElementById('attackBtn');
    
    questionText.textContent = question;
    answerOptions.innerHTML = '';
    
    answers.forEach(answer => {
        const option = document.createElement('div');
        option.className = 'answer-option';
        option.textContent = answer;
        option.addEventListener('click', () => checkAnswer(answer, option));
        answerOptions.appendChild(option);
    });
    
    questionPhase.style.display = 'block';
    attackBtn.style.display = 'none';
}

// Check answer
function checkAnswer(selectedAnswer, optionElement) {
    const answerOptions = document.querySelectorAll('.answer-option');
    const questionPhase = document.getElementById('questionPhase');
    
    // Disable all options
    answerOptions.forEach(option => {
        option.style.pointerEvents = 'none';
        if (option.textContent === battleState.correctAnswer) {
            option.classList.add('correct');
        } else if (option === optionElement) {
            option.classList.add('incorrect');
        }
    });
    
    // Check if answer is correct
    if (selectedAnswer === battleState.correctAnswer) {
        showMessage('Correct! Your pet attacks!', 'success');
        setTimeout(() => {
            performAttack('user');
            questionPhase.style.display = 'none';
        }, 1500);
    } else {
        showMessage('Wrong! Enemy attacks!', 'error');
        setTimeout(() => {
            performAttack('enemy');
            questionPhase.style.display = 'none';
        }, 1500);
    }
}

// Perform attack
function performAttack(attacker) {
    const userPet = battleState.userPets[battleState.currentUserPetIndex];
    const enemyPet = battleState.enemyPets[battleState.currentEnemyPetIndex];
    
    if (attacker === 'user') {
        // User attacks enemy
        const damage = userPet.currentAttack;
        enemyPet.currentHP = Math.max(0, enemyPet.currentHP - damage);
        
        showMessage(`${userPet.name} deals ${damage} damage to ${enemyPet.name}!`, 'success');
        
        // Check if enemy pet is defeated
        if (enemyPet.currentHP <= 0) {
            handleEnemyDefeated();
        } else {
            battleState.currentTurn = 'enemy';
            setTimeout(() => enemyTurn(), 2000);
        }
    } else {
        // Enemy attacks user
        const damage = enemyPet.currentAttack;
        userPet.currentHP = Math.max(0, userPet.currentHP - damage);
        
        showMessage(`${enemyPet.name} deals ${damage} damage to ${userPet.name}!`, 'error');
        
        // Check if user pet is defeated
        if (userPet.currentHP <= 0) {
            handleUserDefeated();
        } else {
            battleState.currentTurn = 'user';
        }
    }
    
    updateBattleDisplay();
}

// Handle enemy defeated
function handleEnemyDefeated() {
    const enemyPet = battleState.enemyPets[battleState.currentEnemyPetIndex];
    showMessage(`${enemyPet.name} has been defeated!`, 'success');
    
    battleState.currentEnemyPetIndex++;
    
    // Check if all enemies are defeated
    if (battleState.currentEnemyPetIndex >= battleState.enemyPets.length) {
        endBattle(true);
    } else {
        battleState.currentTurn = 'user';
        updateBattleDisplay();
    }
}

// Handle user defeated
function handleUserDefeated() {
    const userPet = battleState.userPets[battleState.currentUserPetIndex];
    showMessage(`${userPet.name} has been defeated!`, 'error');
    
    battleState.currentUserPetIndex++;
    
    // Check if all user pets are defeated
    if (battleState.currentUserPetIndex >= battleState.userPets.length) {
        endBattle(false);
    } else {
        // Show next pet button
        const nextPetBtn = document.getElementById('nextPetBtn');
        nextPetBtn.style.display = 'inline-block';
    }
}

// Switch to next pet
function switchToNextPet() {
    battleState.currentTurn = 'user';
    updateBattleDisplay();
}

// Enemy turn (simple attack based on enemy's attack stat)
function enemyTurn() {
    if (!battleState.isBattleActive) return;
    
    setTimeout(() => {
        const enemyPet = battleState.enemyPets[battleState.currentEnemyPetIndex];
        const userPet = battleState.userPets[battleState.currentUserPetIndex];
        
        // Enemy attacks directly with its attack stat
        showMessage(`${enemyPet.name} attacks!`, 'error');
        performAttack('enemy');
    }, 1500);
}

// Flee battle
function fleeBattle() {
    if (confirm('Are you sure you want to flee? You will lose the battle!')) {
        endBattle(false);
    }
}

// End battle
function endBattle(victory) {
    battleState.isBattleActive = false;
    
    const battlePhase = document.getElementById('battlePhase');
    const battleResults = document.getElementById('battleResults');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    const rewardsSection = document.getElementById('rewardsSection');
    const rewardsList = document.getElementById('rewardsList');
    
    battlePhase.style.display = 'none';
    battleResults.style.display = 'block';
    
    if (victory) {
        resultTitle.textContent = '🎉 Victory!';
        resultTitle.className = 'result-title victory';
        resultMessage.textContent = 'Congratulations! You defeated all enemy pets!';
        
        // Calculate rewards
        const coinReward = battleState.enemyPets.length * 20;
        const expReward = battleState.enemyPets.length * 10;
        
        rewardsSection.style.display = 'block';
        rewardsList.innerHTML = `
            <div class="reward-item">💰 ${coinReward} Coins</div>
            <div class="reward-item">⭐ ${expReward} EXP</div>
        `;
        
        // Add rewards
        userData.coins += coinReward;
        
        // Add EXP to user's pets
        battleState.userPets.forEach(pet => {
            if (pet.currentHP > 0) {
                const petDetails = userData.petDetails[pet.id];
                if (petDetails) {
                    petDetails.exp += expReward;
                    
                    // Check for level up
                    const expToNext = getExpToNextLevel(petDetails.level);
                    while (petDetails.exp >= expToNext) {
                        petDetails.exp -= expToNext;
                        petDetails.level += 1;
                    }
                }
            }
        });
        
        // Save data
        saveUserData();
        updateCoinsDisplay();
        
    } else {
        resultTitle.textContent = '💀 Defeat';
        resultTitle.className = 'result-title defeat';
        resultMessage.textContent = 'Your pets have been defeated. Try again!';
        rewardsSection.style.display = 'none';
    }
}

// Reset battle
function resetBattle() {
    // Reset battle state
    battleState = {
        userPets: [],
        enemyPets: [],
        currentUserPetIndex: 0,
        currentEnemyPetIndex: 0,
        currentTurn: 'user',
        isBattleActive: false,
        selectedUserPets: [],
        currentQuestion: null,
        correctAnswer: null
    };
    
    // Switch back to pet selection
    document.getElementById('battlePhase').style.display = 'none';
    document.getElementById('battleResults').style.display = 'none';
    document.getElementById('petSelectionPhase').style.display = 'block';
    
    // Clear selections
    const selectedCards = document.querySelectorAll('.selection-pet-card.selected');
    selectedCards.forEach(card => card.classList.remove('selected'));
    
    document.getElementById('startBattleBtn').style.display = 'none';
}

// Go back function
function goBack() {
    window.location.href = '../../profile.html';
}

// Add battle system initialization to main setup
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadUserData();
    initializeBattleSystem(); // Initialize battle system
});