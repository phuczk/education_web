// Get source ID from URL
function getSourceIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

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

    lessons.forEach(lesson => {
        const lessonDiv = document.createElement('div');
        lessonDiv.className = 'lesson-item';
        
        let videosHtml = `
            <div class="lesson-header">
                <h4>${lesson.title}</h4>
                <span class="video-count">${lesson.videos.length} video</span>
            </div>
            <div class="videos-row">
        `;

        lesson.videos.forEach(video => {
            videosHtml += `
                <div class="video-card">
                    <div class="video-thumbnail">
                        <video src="${video.url}" controls></video>
                    </div>
                    <p class="video-title">${video.title}</p>
                </div>
            `;
        });

        videosHtml += `</div>`;
        lessonDiv.innerHTML = videosHtml;
        lessonsContainer.appendChild(lessonDiv);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderDetailPage();
});
