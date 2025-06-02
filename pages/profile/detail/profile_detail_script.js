const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');

fetch(`https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/sourses/${courseId}`)
    .then(res => res.json())
    .then(course => {
        document.getElementById('course-title').textContent = course.title;
        document.getElementById('course-description').textContent = course.description;

        const lessonsList = document.getElementById('lessons-list');
        const player = document.getElementById('youtube-player');
        const lessonDesc = document.getElementById('lesson-description');
        const lessonEx = document.getElementById('lesson-exercise');

        if (!course.lessons.length) {
            lessonsList.textContent = 'Không có bài học nào.';
            return;
        }

        // Load video + info đầu tiên
        setLesson(course.lessons[0]);

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

            lessonDiv.addEventListener('click', () => setLesson(lesson));

            lessonsList.appendChild(lessonDiv);
        });

        function setLesson(lesson) {
            player.src = convertToEmbedUrl(lesson.youtube);
            lessonDesc.textContent = lesson.description;
            lessonEx.textContent = lesson.exercise;
        }

        function convertToEmbedUrl(url) {
            const videoId = url.includes('watch?v=') ? url.split('watch?v=')[1].split('&')[0] : url.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        }
    })
    .catch(err => {
        console.error('Lỗi khi tải thông tin khóa học:', err);
    });
