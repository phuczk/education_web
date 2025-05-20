const staffApi = 'https://65bf081adcfcce42a6f31afe.mockapi.io/api/v1/greenclass/staffs';
let allStaffs = [];

// Gọi API để lấy danh sách staffs
fetch(staffApi)
    .then(res => res.json())
    .then(data => {
        allStaffs = data;
        const subjects = [...new Set(data.map(staff => staff.subject))];
        renderSubjects(subjects);
        renderStaffs(data); // Hiển thị tất cả lúc đầu
    });

// Render các nút lọc theo subject
function renderSubjects(subjects) {
    const container = document.getElementById('subjects');
    container.innerHTML = '';

    // Nút "All"
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.className = 'subject-btn';
    allBtn.onclick = () => renderStaffs(allStaffs);
    container.appendChild(allBtn);

    // Nút theo từng subject
    subjects.forEach(subject => {
        const btn = document.createElement('button');
        btn.textContent = subject;
        btn.className = 'subject-btn';
        btn.onclick = () => {
            const filtered = allStaffs.filter(s => s.subject === subject);
            renderStaffs(filtered);
        };
        container.appendChild(btn);
    });
}

// Hiển thị danh sách staffs
function renderStaffs(staffs) {
    const list = document.getElementById('staffList');
    list.innerHTML = '';

    staffs.forEach(staff => {
        const card = document.createElement('div');
        card.className = 'staff-card';
        card.innerHTML = `
            <img src="${staff.avatar}" alt="${staff.name}" class="staff-avatar">
            <div class="staff-info">
                <h3>${staff.gender ? 'Co' : 'Thay'}: ${staff.name}</h3>
                <p><strong>Môn dạy:</strong> ${staff.subject}</p>
            </div>
        `;
        list.appendChild(card);
    });
}
