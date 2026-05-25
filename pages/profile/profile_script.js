const userId = localStorage.getItem('userId');
const usersApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users';
const sourcesApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/sourses';

const ranks = [
    {
        id: 1,
        title: 'Bronze',
        image: '../../data/image/rank/bronze.png',
        baseScore: 100
    },
    {
        id: 2,
        title: 'Silver',
        image: '../../data/image/rank/silver.png',
        baseScore: 300
    },
    {
        id: 3,
        title: 'Gold',
        image: '../../data/image/rank/gold.png',
        baseScore: 700
    },
    {
        id: 4,
        title: 'Platinum',
        image: '../../data/image/rank/platinum.png',
        baseScore: 1500
    },
    {
        id: 5,
        title: 'Diamond',
        image: '../../data/image/rank/daimond.png',
        baseScore: 3000
    },
    {
        id: 6,
        title: 'Master',
        image: '../../data/image/rank/master.png',
        baseScore: 5000
    },
    {
        id: 7,
        title: 'Grandmaster',
        image: '../../data/image/rank/grandmaster.png',
        baseScore: 8000
    },
    {
        id: 8,
        title: 'Legend',
        image: '../../data/image/rank/legend.png',
        baseScore: 12000
    },
    {
        id: 9,
        title: 'Immortal',
        image: '../../data/image/rank/imortal.png',
        baseScore: 20000
    }
];

// Compute user's score, determine rank/level/badges, update UI and persist to API if changed
async function computeAndSaveRank(user) {
    try {
        const coins = Number(user.coins || 0);
        const streak = Number(user.streak || 0);
        const sourcesProgress = Array.isArray(user.sourcesProgress) ? user.sourcesProgress : [];
        const totalCompleted = sourcesProgress.reduce((s, p) => s + (Number(p.complete) || 0), 0);

        const score = coins + totalCompleted * 100 + streak * 10;

        // Determine rank: highest rank with baseScore <= score
        let currentRank = ranks[0];
        for (const r of ranks) {
            if (score >= r.baseScore) currentRank = r;
        }

        const level = Math.max(1, Math.floor(score / 500));

        // Simple badges based on milestones
        const badges = [];
        if (streak >= 7) badges.push('7-day-streak');
        if (totalCompleted >= 10) badges.push('completed-10');
        if (coins >= 1000) badges.push('wealthy-learner');

        // Update UI
        const rankImg = document.getElementById('userRankImg');
        const rankTitle = document.getElementById('userRankTitle');
        const levelEl = document.getElementById('userLevelVal');
        const badgesEl = document.getElementById('userBadges');
        const scoreAmountEl = document.getElementById('userScoreAmount');

        if (rankImg) rankImg.src = currentRank.image || '';
        if (rankTitle) rankTitle.textContent = currentRank.title || '';
        if (levelEl) levelEl.textContent = level;
        if (scoreAmountEl) scoreAmountEl.textContent = score;

        if (badgesEl) {
            badgesEl.innerHTML = '';
            badges.forEach(b => {
                const span = document.createElement('span');
                span.className = 'badge';
                // map known badges to emoji for now
                const map = {
                    '7-day-streak': '🔥',
                    'completed-10': '🏆',
                    'wealthy-learner': '💎'
                };
                span.textContent = map[b] || '🏅';
                badgesEl.appendChild(span);
            });
        }

        updateRankTooltip();

        // Persist changes if different
        const toUpdate = {};
        if (user.currentRank !== currentRank.title) toUpdate.currentRank = currentRank.title;
        if (Number(user.level) !== level) toUpdate.level = level;
        if (JSON.stringify(user.badges || []) !== JSON.stringify(badges)) toUpdate.badges = badges;

        if (Object.keys(toUpdate).length > 0) {
            const updatedUser = { ...user, ...toUpdate };
            await fetch(`${usersApi}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            });
        }

        return { score, rank: currentRank.title, level, badges };
    } catch (err) {
        console.error('computeAndSaveRank error', err);
        throw err;
    }
}

function updateRankTooltip() {
    const tooltip = document.getElementById('rankTooltip');
    if (!tooltip) return;

    const content = tooltip.querySelector('.tooltip-content');
    if (!content) return;

    content.innerHTML = '<h4>Rank requirements</h4>' + ranks.map(rank => `
        <div class="rank-item">
            <img src="${rank.image}" alt="${rank.title}" class="rank-item-img">
            <strong>${rank.title}</strong>
            <span>${rank.baseScore} pts</span>
        </div>
    `).join('');
}

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

    const rankCard = document.getElementById('userRank');
    const rankTooltip = document.getElementById('rankTooltip');

    if (rankCard && rankTooltip) {
        rankCard.addEventListener('click', event => {
            event.stopPropagation();
            rankTooltip.classList.toggle('visible');
        });

        document.addEventListener('click', () => {
            rankTooltip.classList.remove('visible');
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

            // Display user name if available
            const userNameEl = document.getElementById('userName');
            if (userNameEl) userNameEl.textContent = user.name || (user.username || 'User');

            // Update rank/level/badges and persist if changed
            computeAndSaveRank(user).catch(err => console.error('Rank update error', err));

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
                    renderLearningProgressAll(user, myCourses);
                    createLearningProgressChart(user);
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

function renderLearningProgressAll(user, courses) {
    const container = document.getElementById('learningProgressAll');
    if (!container) return;

    if (!Array.isArray(courses) || courses.length === 0) {
        container.innerHTML = '<p>Bạn chưa đăng ký khóa học nào.</p>';
        return;
    }

    const sourcesProgress = Array.isArray(user.sourcesProgress) ? user.sourcesProgress : [];
    container.innerHTML = '';

    courses.forEach(course => {
        const progress = sourcesProgress.find(item => item.id === course.id) || {};
        const complete = progress.complete || 0;
        const max = progress.max || (Array.isArray(course.lessons) ? course.lessons.length : 0);
        const percentage = max > 0 ? Math.round((complete / max) * 100) : 0;
        const totalSeconds = progress.totalSeconds || 0;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const timeString = totalSeconds > 0 ? (hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`) : '0m';
        const completeAt = progress.completeAt ? new Date(progress.completeAt).toLocaleDateString('vi-VN') : 'Chưa hoàn thành';

        const progressHtml = `
            <div class="progress-card">
                <div class="progress-header">
                    <h3>${course.title}</h3>
                    <span>${complete}/${max} bài</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-footer">
                    <span>${percentage}% hoàn thành</span>
                    <span>Thời gian: ${timeString}</span>
                    <span>Hoàn thành: ${completeAt}</span>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', progressHtml);
    });
}

function createLearningProgressChart(user) {
    const chartContainer = document.getElementById('learningProgressChartContainer');
    if (!chartContainer) return;

    const progressEntries = Array.isArray(user.sourcesProgress) ? user.sourcesProgress : [];
    if (progressEntries.length === 0) {
        chartContainer.innerHTML = '<p>Chưa có dữ liệu tiến độ để hiển thị biểu đồ.</p>';
        return;
    }

    chartContainer.innerHTML = '<canvas id="progressChart"></canvas>';
    const dailyProgress = new Map();

    progressEntries.forEach(entry => {
        if (!entry.completeAt) return;
        const dt = new Date(entry.completeAt);
        const dateKey = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        const value = Number(entry.complete) || 0;
        const existing = dailyProgress.get(dateKey) || 0;
        dailyProgress.set(dateKey, Math.max(existing, value));
    });

    const labels = [];
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const dateKey = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        labels.push(day.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));
        data.push(dailyProgress.get(dateKey) || 0);
    }

    const ctx = document
        .getElementById('progressChart')
        .getContext('2d');

    const maxPoint = Math.max(...data, 0);
    const yAxisMax = Math.max(maxPoint + 2, 10);

    const gradient = ctx.createLinearGradient(
    0,
    0,
    0,
    300
);

gradient.addColorStop(
    0,
    'rgba(52, 152, 219, 0.45)'
);

gradient.addColorStop(
    1,
    'rgba(52, 152, 219, 0.02)'
);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Số bài hoàn thành',
                data,
                borderColor: '#3498db',
                backgroundColor:
                    gradient,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#fff9f9',
                pointBorderColor: '#3498db',
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        title: context =>
                            `Ngày: ${context[0].label}`,

                        label: context =>
                            `Hoàn thành: ${context.parsed.y} bài`
                    }
                }
            },

            scales: {
                y: {
                    beginAtZero: true,

                    min: 0,
                    max: yAxisMax,

                    ticks: {
                        precision: 0,
                        stepSize: 1
                    },

                    title: {
                        display: true,
                        text: 'Số bài hoàn thành'
                    }
                },

                x: {
                    title: {
                        display: true,
                        text: 'Ngày'
                    }
                }
            }
        }
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

        // Recompute and save rank after coin change
        try {
            const updatedUserResponse = await fetch(`${usersApi}/${userId}`);
            const updatedUser = await updatedUserResponse.json();
            await computeAndSaveRank(updatedUser);
        } catch (e) {
            console.error('Error updating rank after claim', e);
        }

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

