const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');

fetch(`https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/sourses/${courseId}`)
    .then(res => res.json())
    .then(course => {
        // Gán thông tin tiêu đề khóa học
        document.getElementById('course-title').textContent = course.title;
        document.getElementById('course-description').textContent = course.description;

        const lessonsList = document.getElementById('lessons-list');
        const player = document.getElementById('youtube-player');
        const lessonDesc = document.getElementById('lesson-description');
        const lessonEx = document.getElementById('lesson-exercise');

        if (!course.lessons.length) {
            lessonsList.innerHTML = '<p>Không có bài học nào.</p>';
            return;
        }

        // Phát video và nội dung đầu tiên mặc định
        player.src = convertToEmbedUrl(course.lessons[0].youtube);
        lessonDesc.textContent = course.lessons[0].description;
        lessonEx.textContent = course.lessons[0].exercise;

        lessonsList.innerHTML = '';
        course.lessons.forEach((lesson, index) => {
            const lessonDiv = document.createElement('div');
            lessonDiv.className = 'lesson-item';
            lessonDiv.innerHTML = `<h4>Bài ${index + 1}: ${lesson.title}</h4>`;

            lessonDiv.addEventListener('click', () => {
                player.src = convertToEmbedUrl(lesson.youtube);
                lessonDesc.textContent = lesson.description;
                lessonEx.textContent = lesson.exercise;
            });

            lessonsList.appendChild(lessonDiv);
        });

        function convertToEmbedUrl(url) {
            const videoId = url.includes('watch?v=') ? url.split('watch?v=')[1].split('&')[0] : url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
    })
    .catch(err => {
        console.error('Lỗi khi tải thông tin khóa học:', err);
    });
