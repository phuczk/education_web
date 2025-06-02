const apiUrl = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/sourses';
let allSources = [];

// Lấy dữ liệu từ API
fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
        allSources = data;
        const categories = [...new Set(data.map(item => item.category))];
        renderCategories(categories);
        renderSources(data); // Hiển thị tất cả lúc đầu
    });

// Render các nút category
function renderCategories(categories) {
    const container = document.getElementById('categories');
    container.innerHTML = ''; // Xóa cũ nếu có

    // Nút "All"
    const allBtn = document.createElement('button');
    allBtn.className = 'category-btn selected'; // Mặc định chọn "All"
    allBtn.textContent = 'All';
    allBtn.addEventListener('click', () => {
        renderSources(allSources);
        updateSelectedCategory(allBtn);
    });
    container.appendChild(allBtn);

    // Các nút category theo từng loại
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = cat;
        btn.addEventListener('click', () => {
            const filtered = allSources.filter(source => source.category === cat);
            renderSources(filtered);
            updateSelectedCategory(btn);
        });
        container.appendChild(btn);
    });
}

// Cập nhật class selected cho category được chọn
function updateSelectedCategory(selectedBtn) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    selectedBtn.classList.add('selected');
}

// Render danh sách sources
function renderSources(sources) {
    const list = document.getElementById('sourceList');
    list.innerHTML = '';

    sources.forEach(source => {
        const li = document.createElement('li');

        // Xác định class theo cost
        let costClass = '';
        if (source.cost < 20) {
            costClass = 'cost-low';
        } else if (source.cost < 50) {
            costClass = 'cost-medium';
        } else if (source.cost < 70) {
            costClass = 'cost-high';
        }

        li.className = `source-item ${costClass}`;
        li.innerHTML = `
            <img src="${source.thumbnailSources}" alt="${source.title}">
            <div class="source-title">${source.title}</div>
            <div class="source-cost">Cost: $${source.cost}</div>
            <div class="source-description">${source.description}</div>
        `;

        // Chuyển hướng đến trang chi tiết khi click
        li.addEventListener('click', () => {
            window.location.href = `detail/sources_detail.html?id=${source.id}`;
        });

        list.appendChild(li);
    });
}
