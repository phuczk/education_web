const sourceApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/sourses';
const usersApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users';

// Lấy ID khóa học từ URL
const urlParams = new URLSearchParams(window.location.search);
const sourceId = urlParams.get('id');

// Lấy thông tin khóa học và hiển thị
fetch(`${sourceApi}/${sourceId}`)
    .then(res => res.json())
    .then(data => {
        renderSourceDetail(data);
    })
    .catch(err => {
        console.error("Lỗi khi tải chi tiết:", err);
        document.getElementById('sourceDetail').innerHTML = "<p>Không thể tải dữ liệu chi tiết.</p>";
    });

// Hiển thị thông tin khóa học + nút mua
function renderSourceDetail(source) {
    const container = document.getElementById('sourceDetail');
    container.innerHTML = `
        <h1 class="source-title">${source.title}</h1>
        <img class="source-image" src="${source.thumbnailSources}" alt="${source.title}">
        <p class="source-cost">💰 Giá: $${source.cost}</p>
        <p class="source-category">📚 Danh mục: ${source.category}</p>
        <p class="source-description">📝 Mô tả: ${source.description}</p>
        <button onclick="buyCourse('${source.id}')" class="buy-button">🛒 Mua khóa học</button>
    `;
}

// Hàm mua khóa học
function buyCourse(courseId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('⚠️ Vui lòng đăng nhập để mua khóa học.');
        return;
    }

    fetch(`${usersApi}/${userId}`)
        .then(res => res.json())
        .then(user => {
            const currentCourses = user.sourcesId || [];

            if (currentCourses.includes(courseId)) {
                alert('📝 Bạn đã mua khóa học này rồi!');
                return;
            }

            const updatedCourses = [...currentCourses, courseId];

            fetch(`${usersApi}/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourcesId: updatedCourses })
            })
                .then(res => res.json())
                .then(updatedUser => {
                    alert('✅ Mua khóa học thành công!');
                    console.log('User updated:', updatedUser);
                })
                .catch(err => {
                    console.error('❌ Lỗi khi cập nhật user:', err);
                    alert('❌ Có lỗi xảy ra khi mua khóa học.');
                });
        })
        .catch(err => {
            console.error('❌ Không thể lấy dữ liệu người dùng:', err);
            alert('❌ Có lỗi xảy ra khi xác minh tài khoản.');
        });
}
