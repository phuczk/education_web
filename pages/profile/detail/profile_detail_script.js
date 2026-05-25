const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');
const userId = localStorage.getItem('userId');
const usersApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users';

function updateUserData(userId, updates) {
    return fetch(`${usersApi}/${userId}`)
        .then(res => res.json())
        .then(user => {
            const merged = {
                ...user,
                ...updates
            };
            return fetch(`${usersApi}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(merged)
            });
        });
}

function incrementStreak() {
    if (!userId) return;
    fetch(`${usersApi}/${userId}`)
        .then(res => res.json())
        .then(user => {
            const currentStreak = user.streak || 0;
            const newStreak = currentStreak + 1;
            return updateUserData(userId, { streak: newStreak });
        })
        .then(() => console.log('Streak incremented'))
        .catch(err => console.error('Error incrementing streak:', err));
}

function addCoins(amount, reason = 'hoàn thành bài học') {
    if (!userId) return;

    updateUserData(userId, {})
        .then(res => res.json())
        .then(user => {
            const currentCoins = user.coins || 0;
            const newCoins = currentCoins + amount;
            return updateUserData(userId, { coins: newCoins });
        })
        .then(() => {
            console.log(`Added ${amount} coins for ${reason}`);
            showCoinNotification(amount, reason);
        })
        .catch(err => console.error('Error adding coins:', err));
}

function updateSourcesProgress(courseId, lesson, totalLessons) {
    if (!userId) return;
    const now = new Date().toISOString();

    return fetch(`${usersApi}/${userId}`)
        .then(res => res.json())
        .then(user => {
            const sourcesProgress = Array.isArray(user.sourcesProgress) ? user.sourcesProgress : [];
            const existingIndex = sourcesProgress.findIndex(item => item.id === courseId);
            const completedLessons = [];

            if (existingIndex >= 0) {
                const existing = sourcesProgress[existingIndex];
                const currentCompleted = Array.isArray(existing.completedLessons) ? existing.completedLessons : [];

                if (!currentCompleted.includes(lesson.id)) {
                    currentCompleted.push(lesson.id);
                }

                sourcesProgress[existingIndex] = {
                    ...existing,
                    id: courseId,
                    complete: currentCompleted.length,
                    max: totalLessons,
                    totalSeconds: existing.totalSeconds || 0,
                    completeAt: now,
                    completedLessons: currentCompleted
                };
            } else {
                completedLessons.push(lesson.id);
                sourcesProgress.push({
                    id: courseId,
                    complete: 1,
                    max: totalLessons,
                    totalSeconds: 0,
                    completeAt: now,
                    completedLessons
                });
            }

            return updateUserData(userId, { sourcesProgress });
        })
        .then(res => res.json())
        .then(updatedUser => {
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log('sourcesProgress updated:', updatedUser.sourcesProgress);
        })
        .catch(err => console.error('Error updating sourcesProgress:', err));
}

function showCoinNotification(amount, reason) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ff69b4, #ff1493);
        color: white;
        padding: 15px 20px;
        border-radius: 25px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `🪙 +${amount} coins cho ${reason}!`;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

fetch(`https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/sourses/${courseId}`)
    .then(res => res.json())
    .then(course => {
        document.getElementById('course-title').textContent = course.title;
        document.getElementById('course-description').textContent = course.description;

        const lessonsList = document.getElementById('lessons-list');
        const player = document.getElementById('youtube-player');
        const lessonDesc = document.getElementById('lesson-description');
        const lessonEx = document.getElementById('lesson-exercise');
        const chatButtonContainer = document.getElementById('chat-button-container');

        if (!course.lessons.length) {
            lessonsList.textContent = 'Không có bài học nào.';
            return;
        }

        setLesson(course.lessons[0]);

        if (userId) {
            fetch(`${usersApi}/${userId}`)
                .then(res => res.json())
                .then(user => {
                    const registered = Array.isArray(user.sourcesId) && user.sourcesId.includes(courseId);
                    if (registered) {
                        const roomName = encodeURIComponent(course.title);
                        const roomId = encodeURIComponent(`${courseId}`);
                        chatButtonContainer.innerHTML = `
                            <a
                                class="chat-button"
                                href="./chat/index.html?room=${roomId}&roomName=${roomName}"
                                title="Chat nhóm khóa học"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path d="
                                        M20 2H4
                                        C2.9 2 2 2.9 2 4v18
                                        l4-4h14
                                        c1.1 0 2-.9 2-2V4
                                        c0-1.1-.9-2-2-2z
                                    " />
                                </svg>
                            </a>
                        `;
                    }
                })
                .catch(err => {
                    console.error('Lỗi khi kiểm tra đăng ký:', err);
                });
        }

        course.lessons.forEach((lesson, index) => {
            const lessonDiv = document.createElement('div');
            lessonDiv.className = 'lesson-item';

            const image = document.createElement('img');
            image.className = "lesson-image";
            image.src = "../../../data/image/accordion1.png";
            lessonDiv.appendChild(image);

            const title = document.createElement('h4');
            title.textContent = `Bài ${index + 1}: ${lesson.title}`;
            lessonDiv.appendChild(title);

            lessonDiv.addEventListener('click', () => {
                setLesson(lesson);
                updateSourcesProgress(courseId, lesson, course.lessons.length)
                    .then(() => incrementStreak())
                    .then(() => addCoins(10, `hoàn thành ${lesson.title}`))
                    .catch(err => console.error('Error updating user progress:', err));

                // Update daily quest progress
                updateDailyQuestProgress('lesson_complete', 1);
            });

            // Function to update daily quest progress
            function updateDailyQuestProgress(questType, amount = 1) {
                const dailyQuests = [
                    { id: 'complete_lesson', type: 'lesson_complete' },
                    { id: 'practice_flashcard', type: 'flashcard_practice' },
                    { id: 'typing_practice', type: 'typing_wpm' },
                    { id: 'pet_interaction', type: 'pet_levelup' }
                ];

                const quest = dailyQuests.find(q => q.type === questType);
                if (!quest) return;

                const savedQuests = JSON.parse(localStorage.getItem('dailyQuests') || '{}');
                const questData = savedQuests[quest.id] || { progress: 0, claimed: false };

                if (!questData.claimed) {
                    questData.progress = Math.min(questData.progress + amount, 10); // Cap at 10 for safety
                    savedQuests[quest.id] = questData;
                    localStorage.setItem('dailyQuests', JSON.stringify(savedQuests));

                    // Show notification for quest progress
                    showQuestNotification(`${questType === 'lesson_complete' ? '📚' : '🎯'} Quest progress updated!`);
                }
            }

            function showQuestNotification(message) {
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: linear-gradient(45deg, #4caf50, #45a049);
                    color: white;
                    padding: 12px 18px;
                    border-radius: 20px;
                    font-weight: bold;
                    box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                `;
                notification.textContent = message;

                document.body.appendChild(notification);

                setTimeout(() => {
                    notification.style.animation = 'slideIn 0.3s ease reverse';
                    setTimeout(() => {
                        if (document.body.contains(notification)) {
                            document.body.removeChild(notification);
                        }
                    }, 300);
                }, 2000);
            }

            lessonsList.appendChild(lessonDiv);
        });

        function setLesson(lesson) {
            player.src = convertToEmbedUrl(lesson.youtube);
            lessonDesc.textContent = lesson.description;
            if (lesson.exercise) {
                lessonEx.href = lesson.exercise;
                lessonEx.textContent = lesson.exercise;
            } else {
                lessonEx.href = "#";
                lessonEx.textContent = "Không có bài tập";
            }
        }

        function convertToEmbedUrl(url) {
            const videoId = url.includes('watch?v=') ? url.split('watch?v=')[1].split('&')[0] : url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
    })
    .catch(err => {
        console.error('Lỗi khi tải thông tin khóa học:', err);
    });
