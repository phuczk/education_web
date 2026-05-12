const userId = localStorage.getItem('userId');
const usersApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users';
const sourcesApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/sourses';

function serialize(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== '' && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

function buildAvatarUrl(params) {
  const query = serialize(params);
  return `https://avataaars.io/?${query}`;
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

// Navigate to pets page
function goToPets() {
  window.location.href = 'detail/pet/pet.html';
}

function generateRandomAvatar() {
  const avatarStyle = randomChoice(['Circle', 'Transparent']);
  const topType = randomChoice(['NoHair', 'LongHairBigHair', 'ShortHairShortFlat']);
  const accessoriesType = randomChoice(['Blank', 'Sunglasses']);
  const hairColor = randomChoice(['Black', 'Blonde']);
  const facialHairType = randomChoice(['Blank', 'BeardLight']);
  const clotheType = randomChoice(['ShirtCrewNeck', 'Hoodie']);
  const eyeType = randomChoice(['Default', 'Happy']);
  const eyebrowType = randomChoice(['Default', 'RaisedExcited']);
  const mouthType = randomChoice(['Default', 'Smile']);
  const skinColor = randomChoice(['Light', 'Pale']);
  return {
    avatarStyle,
    topType,
    accessoriesType,
    hairColor,
    facialHairType,
    clotheType,
    eyeType,
    eyebrowType,
    mouthType,
    skinColor
  };
}

document.addEventListener('DOMContentLoaded', () => {
    const freeSourceBtn = document.getElementById('freeSourceBtn');
    if (freeSourceBtn) {
        freeSourceBtn.addEventListener('click', () => {
            window.location.href = 'free_source/free_source.html';
        });
    }

    if (!userId) {
        alert('Bạn chưa đăng nhập!');
        window.location.href = '../../pages/auth/login.html';
        return;
    }

    fetch(`${usersApi}/${userId}`)
        .then(res => res.json())
        .then(user => {
            // Display avatar
            const avatarElement = document.getElementById('userAvatar');
            let avatarData;
            if (user.avatar) {
                try {
                    avatarData = JSON.parse(user.avatar);
                } catch (e) {
                    // If not JSON, assume it's a URL or invalid, generate random
                    avatarData = generateRandomAvatar();
                }
            } else {
                avatarData = generateRandomAvatar();
            }
            const avatarUrl = buildAvatarUrl(avatarData);
            avatarElement.innerHTML = `<img src="${avatarUrl}" alt="User Avatar" style="width: 50px; height: 50px; border-radius: 50%; cursor: pointer;">`;
            avatarElement.addEventListener('click', () => {
                window.location.href = 'avatar_setting/index.html';
            });

            // Display streak
            const streakElement = document.getElementById('userStreak');
            const streak = user.streak || 0;
            const streakIconPath = 'https://cdn-icons-png.flaticon.com/128/426/426833.png';
            streakElement.innerHTML = `
                <div class="streak-icon-wrap">
                    <img src="${streakIconPath}" alt="Streak icon">
                    <div class="eye-overlay">
                        <div class="eyes">
                            <div><i></i></div>
                            <div><i></i></div>
                        </div>
                    </div>
                </div>
                <p>Streak: ${streak}</p>
            `;

            // Display coins
            const coinsElement = document.getElementById('userCoinsAmount');
            const coins = user.coins || 0;
            coinsElement.textContent = coins;

            const sourceIds = user.sourcesId || [];

            if (sourceIds.length === 0) {
                document.getElementById('courses-list').innerHTML = '<p>Bạn chưa đăng ký khóa học nào.</p>';
                return;
            }

            fetch(sourcesApi)
                .then(res => res.json())
                .then(allSources => {
                    const myCourses = allSources.filter(source => sourceIds.includes(source.id));
                    renderCourses(myCourses);
                });
            
            // Initialize daily quests
            initializeDailyQuests();
            updateLoginQuest();
        })
        .catch(err => {
            console.error('Lỗi khi tải thông tin người dùng:', err);
        });
});

function renderCourses(courses) {
    const container = document.getElementById('courses-list');
    container.innerHTML = '';

    courses.forEach(course => {
        const div = document.createElement('div');
        let costClass = '';
        if (course.cost < 20) {
            costClass = 'cost-low';
        } else if (course.cost < 50) {
            costClass = 'cost-medium';
        } else if (course.cost < 70) {
            costClass = 'cost-high';
        }

        div.className = `course-card ${costClass}`;
        div.innerHTML = `
                <h3 class="source-title">${course.title}</h3>
                <img src="${course.thumbnailSources}" alt="${course.title}">
                <p class="source-category"><strong>Môn học:</strong> ${course.category}</p>
                <p class="source-description">${course.description}</p>
            `;

        div.addEventListener('click', () => {
            window.location.href = `detail/profile_detail.html?id=${course.id}`;
        });

        container.appendChild(div);
    });
}

// Daily Quests System
const dailyQuests = [
    {
        id: 'login_daily',
        name: 'Đăng nhập hàng ngày',
        description: 'Đăng nhập vào hệ thống để nhận thưởng',
        icon: '🔑',
        target: 1,
        progress: 0,
        reward: 10,
        type: 'daily_login'
    },
    {
        id: 'complete_lesson',
        name: 'Hoàn thành bài học',
        description: 'Hoàn thành 1 bài học bất kỳ',
        icon: '📚',
        target: 1,
        progress: 0,
        reward: 20,
        type: 'lesson_complete'
    },
    {
        id: 'practice_flashcard',
        name: 'Luyện tập flashcard',
        description: 'Hoàn thành 10 flashcard',
        icon: '🎴',
        target: 10,
        progress: 0,
        reward: 15,
        type: 'flashcard_practice'
    },
    {
        id: 'typing_practice',
        name: 'Luyện gõ phím',
        description: 'Đạt 50 WPM trong bài luyện gõ',
        icon: '⌨️',
        target: 50,
        progress: 0,
        reward: 25,
        type: 'typing_wpm'
    },
    {
        id: 'pet_interaction',
        name: 'Tương tác với pet',
        description: 'Nâng cấp pet 1 lần',
        icon: '🐾',
        target: 1,
        progress: 0,
        reward: 30,
        type: 'pet_levelup'
    }
];

// Initialize daily quests
function initializeDailyQuests() {
    const savedQuests = localStorage.getItem('dailyQuests');
    const lastReset = localStorage.getItem('lastQuestReset');
    const today = new Date().toDateString();
    
    // Reset quests if it's a new day
    if (lastReset !== today) {
        resetDailyQuests();
    }
    
    let questData = savedQuests ? JSON.parse(savedQuests) : {};
    
    // Load quest progress
    dailyQuests.forEach(quest => {
        if (questData[quest.id]) {
            quest.progress = questData[quest.id].progress;
            quest.claimed = questData[quest.id].claimed;
        }
    });
    
    renderDailyQuests();
    startResetTimer();
}

// Reset daily quests
function resetDailyQuests() {
    const questData = {};
    dailyQuests.forEach(quest => {
        quest.progress = 0;
        quest.claimed = false;
        questData[quest.id] = {
            progress: 0,
            claimed: false
        };
    });
    
    localStorage.setItem('dailyQuests', JSON.stringify(questData));
    localStorage.setItem('lastQuestReset', new Date().toDateString());
}

// Render daily quests
function renderDailyQuests() {
    const questsGrid = document.getElementById('questsGrid');
    questsGrid.innerHTML = '';
    
    dailyQuests.forEach(quest => {
        const questCard = createQuestCard(quest);
        questsGrid.appendChild(questCard);
    });
}

// Create quest card
function createQuestCard(quest) {
    const card = document.createElement('div');
    card.className = `quest-card ${quest.progress >= quest.target ? 'completed' : ''}`;
    
    const progressPercentage = Math.min((quest.progress / quest.target) * 100, 100);
    
    card.innerHTML = `
        <div class="quest-icon">${quest.icon}</div>
        <div class="quest-name">${quest.name}</div>
        <div class="quest-description">${quest.description}</div>
        <div class="quest-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="progress-text">${quest.progress}/${quest.target}</div>
        </div>
        <div class="quest-reward">
            <span class="coin-icon">💰</span>
            <span>${quest.reward}</span>
        </div>
        ${quest.progress >= quest.target && !quest.claimed ? 
            `<button class="quest-claim-btn" onclick="claimQuestReward('${quest.id}')">Claim Reward</button>` : 
            (quest.claimed ? '<button class="quest-claim-btn" disabled>Claimed</button>' : '')
        }
    `;
    
    return card;
}

// Update quest progress
function updateQuestProgress(questType, amount = 1) {
    const quest = dailyQuests.find(q => q.type === questType);
    if (!quest || quest.claimed) return;
    
    quest.progress = Math.min(quest.progress + amount, quest.target);
    
    // Save to localStorage
    const savedQuests = JSON.parse(localStorage.getItem('dailyQuests') || '{}');
    savedQuests[quest.id] = {
        progress: quest.progress,
        claimed: quest.claimed
    };
    localStorage.setItem('dailyQuests', JSON.stringify(savedQuests));
    
    renderDailyQuests();
}

// Claim quest reward
async function claimQuestReward(questId) {
    const quest = dailyQuests.find(q => q.id === questId);
    if (!quest || quest.progress < quest.target || quest.claimed) return;
    
    try {
        // Update user coins
        const response = await fetch(`${usersApi}/${userId}`);
        const user = await response.json();
        
        const newCoins = (user.coins || 0) + quest.reward;
        
        await fetch(`${usersApi}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...user,
                coins: newCoins
            })
        });
        
        // Mark quest as claimed
        quest.claimed = true;
        const savedQuests = JSON.parse(localStorage.getItem('dailyQuests') || '{}');
        savedQuests[questId] = {
            progress: quest.progress,
            claimed: true
        };
        localStorage.setItem('dailyQuests', JSON.stringify(savedQuests));
        
        // Update UI
        document.getElementById('userCoinsAmount').textContent = newCoins;
        renderDailyQuests();
        showQuestMessage(`🎉 Nhận được ${quest.reward} coins từ ${quest.name}!`, 'success');
        
    } catch (error) {
        console.error('Error claiming quest reward:', error);
        showQuestMessage('❌ Không thể nhận thưởng. Vui lòng thử lại!', 'error');
    }
}

// Show quest message
function showQuestMessage(message, type) {
    const messageElement = document.getElementById('questMessage');
    messageElement.textContent = message;
    messageElement.className = `quest-message ${type}`;
    
    setTimeout(() => {
        messageElement.className = 'quest-message';
    }, 3000);
}

// Start reset timer
function startResetTimer() {
    const updateTimer = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeDiff = tomorrow - now;
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        const timerElement = document.getElementById('resetTimer');
        if (timerElement) {
            timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Auto-update login quest
function updateLoginQuest() {
    const lastLogin = localStorage.getItem('lastLoginDate');
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
        updateQuestProgress('daily_login', 1);
        localStorage.setItem('lastLoginDate', today);
    }
}

