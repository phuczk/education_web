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

