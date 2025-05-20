const userId = localStorage.getItem('userId');
const usersApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users';
const sourcesApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/sourses';

if (!userId) {
    alert('Bạn chưa đăng nhập!');
    window.location.href = '../../auth/login.html';
}
fetch(`${usersApi}/${userId}`)
    .then(res => res.json())
    .then(user => {
        const sourceIds = user.sourcesId || [];

        if (sourceIds.length === 0) {
            document.getElementById('courses-list').innerHTML = '<p>Bạn chưa đăng ký khóa học nào.</p>';
            return;
        }

        // Lấy tất cả khóa học
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
                <p class="source-category"><strong>Danh mục:</strong> ${course.category}</p>
                <p class="source-cost"><strong>Học phí:</strong> $${course.cost}</p>
                <p class="source-description">${course.description}</p>
            `;

        // 👉 Gán sự kiện click để chuyển trang với id khóa học
        div.addEventListener('click', () => {
            window.location.href = `detail/profile_detail.html?id=${course.id}`;
        });

        container.appendChild(div);
    });
}

