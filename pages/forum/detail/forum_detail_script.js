const threadId = new URLSearchParams(window.location.search).get('id');

const threadApi = `https://682dcaf54fae1889475791ed.mockapi.io/api/v2/greenclass/threads/${threadId}`;
const postsApi = `https://682dcaf54fae1889475791ed.mockapi.io/api/v2/greenclass/posts`;

// Hiển thị thread
fetch(threadApi)
    .then(res => res.json())
    .then(thread => {
        document.getElementById('thread-info').innerHTML = `
          <h2>${thread.title}</h2>
          <p><strong>Description:</strong> ${thread.description}</p>
          <p><strong>Category:</strong> ${thread.category}</p>
        `;
    });

// Hiển thị các post thuộc thread đó
fetch(postsApi)
    .then(res => res.json())
    .then(posts => {
        const filtered = posts.filter(p => p.threadId === threadId);
        const postList = document.getElementById('post-list');
        if (filtered.length === 0) {
            postList.innerHTML = '<p>Không có bài viết nào.</p>';
        } else {
            filtered.forEach(post => {
                const div = document.createElement('div');
                div.className = 'post';
                div.innerHTML = `
              <p>${post.content}</p>
              <p><strong>By:</strong> ${post.createdBy} | <strong>Likes:</strong> ${post.likes}</p>
            `;
                postList.appendChild(div);
            });
        }
    });