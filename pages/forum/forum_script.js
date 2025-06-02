
const API = 'https://682dcaf54fae1889475791ed.mockapi.io/api/v2/greenclass/threads';
const list = document.getElementById('thread-list');

// Load danh sách bài viết
fetch(API)
    .then(res => res.json())
    .then(threads => {
        threads.forEach(thread => {
            const div = document.createElement('div');
            div.className = 'thread';
            div.innerHTML = `
                <h2><a href="detail/forum_detail.html?id=${thread.id}">${thread.title}</a></h2>
                <div class="thread-meta">
                    <span><strong>Chủ đề:</strong> ${thread.category}</span>
                    <span><strong>Người tạo:</strong> ${thread.createdBy}</span>
                </div>
                <p class="thread-stats">
                    <span>👁️ ${thread.views}</span>
                    <span>💬 ${thread.postCount}</span>
                    <span>🗓️ ${new Date(thread.createdAt).toLocaleDateString('vi-VN')}</span>
                </p>
                `;
            list.appendChild(div);
        });
    });

// Xử lý gửi form
document.getElementById('create-thread-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const newThread = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        createdBy: document.getElementById('createdBy').value,
        views: 0,
        postCount: 0,
        createdAt: new Date().toISOString()
    };

    fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newThread)
    })
        .then(res => res.json())
        .then(thread => {
            alert('Tạo bài viết thành công!');
            window.location.reload(); // Load lại để thấy thread mới
        })
        .catch(err => {
            console.error('Lỗi tạo bài viết:', err);
            alert('Tạo bài viết thất bại!');
        });
});

