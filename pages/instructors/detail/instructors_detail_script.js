const sourcesApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/sourses';
const staffApi = 'https://65bf081adcfcce42a6f31afe.mockapi.io/api/v1/greenclass/staffs';
const scheduleApi = 'https://65bf081adcfcce42a6f31afe.mockapi.io/api/v1/greenclass/schedule';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const staffId = urlParams.get('id');

    if (!staffId) {
        document.getElementById('teachingCourses').innerHTML = '<p>❌ Không có staffId trong URL</p>';
        return;
    }

    try {
        const [staffRes, sourcesRes, scheduleRes] = await Promise.all([
            fetch(staffApi),
            fetch(sourcesApi),
            fetch(scheduleApi)
        ]);

        const staffs = await staffRes.json();
        const sources = await sourcesRes.json();
        const schedules = await scheduleRes.json();

        const staff = staffs.find(s => s.id === staffId);
        if (!staff) {
            document.getElementById('teachingCourses').innerHTML = '<p>❌ Không tìm thấy giảng viên</p>';
            return;
        }

        const teachingMap = new Map();

        schedules.forEach(schedule => {
            for (const day in schedule) {
                if (Array.isArray(schedule[day])) {
                    schedule[day].forEach(entry => {
                        if (entry.staffId === staffId) {
                            if (!teachingMap.has(entry.sourceId)) {
                                const source = sources.find(s => s.id === entry.sourceId);
                                if (source) {
                                    teachingMap.set(entry.sourceId, {
                                        source,
                                        times: []
                                    });
                                }
                            }
                            const course = teachingMap.get(entry.sourceId);
                            if (course) {
                                course.times.push({ day, time: entry.time });
                            }
                        }
                    });
                }
            }
        });

        const container = document.getElementById('teachingCourses');
        container.innerHTML = `<h2>🧑‍🏫 Khóa học do <strong>${staff.name}</strong> giảng dạy</h2>`;

        if (teachingMap.size === 0) {
            container.innerHTML += '<p class="no-teaching">🙁 Giảng viên này chưa được phân công dạy khóa học nào.</p>';
            return;
        }

        const html = Array.from(teachingMap.values()).map(({ source, times }) => `
            <div class="course-card">
                <img src="${source.thumbnailSources}" alt="${source.title}" />
                <h3>${source.title}</h3>
                <p>${source.description}</p>
                <p><strong>Lịch dạy:</strong></p>
                <ul>
                    ${times.map(t => `<li>${capitalize(t.day)} - ${t.time}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        container.innerHTML += `<div class="courses-list">${html}</div>`;

    } catch (err) {
        console.error('❌ Lỗi khi tải dữ liệu:', err);
        document.getElementById('teachingCourses').innerHTML = '<p>❌ Đã có lỗi xảy ra khi tải dữ liệu.</p>';
    }
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
