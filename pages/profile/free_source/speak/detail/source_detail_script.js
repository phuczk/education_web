// Get source ID from URL
function getSourceIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

const usersApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users';

function playVideo(url, title, element) {
    const video = document.getElementById('videoPlayer');
    const source = document.getElementById('videoSource');
    const titleEl = document.getElementById('currentVideoTitle');

    source.src = url;
    video.load();
    video.play();

    titleEl.textContent = title;

    // highlight
    document.querySelectorAll('.video-card').forEach(el => {
        el.classList.remove('active');
    });

    if (element) element.classList.add('active');

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function updateSourcesProgress(sourceId, lesson) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.warn('Người dùng chưa đăng nhập, không lưu được tiến trình.');
        return;
    }

    const source = speakSourceData.find(s => s.id === sourceId);
    const maxLessons = source ? source.lessons.length : 0;
    const now = new Date().toISOString();

    fetch(`${usersApi}/${userId}`)
        .then(res => res.json())
        .then(user => {
            const sourcesProgress = Array.isArray(user.sourcesProgress) ? user.sourcesProgress : [];
            const existingIndex = sourcesProgress.findIndex(item => item.id === sourceId);

            if (existingIndex >= 0) {
                const existingProgress = sourcesProgress[existingIndex];
                const completedLessons = Array.isArray(existingProgress.completedLessons) ? existingProgress.completedLessons : [];

                if (!completedLessons.includes(lesson.id)) {
                    completedLessons.push(lesson.id);
                    existingProgress.completedLessons = completedLessons;
                    existingProgress.complete = completedLessons.length;
                    existingProgress.max = maxLessons;
                    existingProgress.completeAt = now;
                    existingProgress.totalSeconds = existingProgress.totalSeconds || 0;
                    sourcesProgress[existingIndex] = existingProgress;
                }
            } else {
                sourcesProgress.push({
                    id: sourceId,
                    complete: 1,
                    max: maxLessons,
                    totalSeconds: 0,
                    completeAt: now,
                    completedLessons: [lesson.id]
                });
            }

            return fetch(`${usersApi}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourcesProgress })
            });
        })
        .then(res => res.json())
        .then(updatedUser => {
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log('Cập nhật sourcesProgress thành công:', updatedUser.sourcesProgress);
        })
        .catch(err => {
            console.error('Lỗi khi lưu tiến trình sourcesProgress:', err);
        });
}

// Render detail page
function renderDetailPage() {
    const sourceId = getSourceIdFromUrl();
    const source = speakSourceData.find(s => s.id === sourceId);

    if (!source) {
        document.getElementById('lessonsContent').innerHTML = '<p>Khóa học không tồn tại</p>';
        return;
    }

    // Set header information
    document.getElementById('sourceTitle').textContent = source.title;
    document.getElementById('sourceImage').src = source.image;
    document.getElementById('sourceDescription').textContent = source.description;

    // Render lessons and videos
    renderLessons(source.lessons);
}

// Render lessons with videos
function renderLessons(lessons) {
    const lessonsContainer = document.getElementById('lessonsContent');
    lessonsContainer.innerHTML = '';
    const sourceId = getSourceIdFromUrl();

    lessons.forEach(lesson => {
        const lessonDiv = document.createElement('div');
        lessonDiv.className = 'lesson-item';

        const lessonHeader = document.createElement('div');
        lessonHeader.className = 'lesson-header';
        lessonHeader.innerHTML = `
            <h4>${lesson.title}</h4>
            <span class="video-count">${lesson.videos.length} video</span>
        `;

        const videosRow = document.createElement('div');
        videosRow.className = 'videos-row';

        lesson.videos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.className = 'video-card';

            const thumbnail = document.createElement('div');
            thumbnail.className = 'video-thumbnail';

            const videoEl = document.createElement('video');
            videoEl.src = video.url;
            videoEl.controls = true;

            const videoTitle = document.createElement('p');
            videoTitle.className = 'video-title';
            videoTitle.textContent = video.title;

            thumbnail.appendChild(videoEl);
            videoCard.appendChild(thumbnail);
            videoCard.appendChild(videoTitle);
            videosRow.appendChild(videoCard);
        });

        lessonDiv.addEventListener('click', event => {
            if (event.target.closest('.video-thumbnail') || event.target.closest('video')) {
                return;
            }
            updateSourcesProgress(sourceId, lesson);
        });

        lessonDiv.appendChild(lessonHeader);
        lessonDiv.appendChild(videosRow);
        lessonsContainer.appendChild(lessonDiv);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderDetailPage();
});
