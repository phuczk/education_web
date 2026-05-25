const apiUrl = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users';

function registerUser() {
    const userName = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const sourcesId = [];

    if (!userName || !password) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    fetch(apiUrl)
        .then(res => res.json())
        .then(users => {
            const isDuplicate = users.some(user => user.userName === userName);
            if (isDuplicate) {
                alert('❌ Tên người dùng đã tồn tại. Vui lòng chọn tên khác.');
                return;
            }

            const newUser = {
                userName,
                password,
                sourcesId,
                streak: 1,
                lastLoginDate: new Date().toDateString()
            };

            return fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
        })
        .then(res => res?.json())
        .then(data => {
            if (data) {
                alert('✅ Đăng ký thành công!');
                console.log('User created:', data);
                localStorage.setItem('userId', data.id);
                localStorage.setItem('user', JSON.stringify(data));
                localStorage.setItem('lastLoginDate', new Date().toDateString());
                window.location.href = '../../pages/dashboard/index.html';
            }
        })
        .catch(err => {
            console.error('❌ Lỗi khi đăng ký:', err);
            alert('❌ Có lỗi xảy ra khi đăng ký: ' + err);
        });
}

function loginUser() {
    const userName = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!userName || !password) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    fetch(apiUrl)
        .then(res => res.json())
        .then(users => {
            const foundUser = users.find(user =>
                user.userName === userName && user.password === password
            );

            if (foundUser) {
                updateStreak(foundUser).then(updatedUser => {
                    alert('✅ Đăng nhập thành công!');
                    console.log('Logged in user:', updatedUser);
                    localStorage.setItem('userId', updatedUser.id);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    localStorage.setItem('lastLoginDate', new Date().toDateString());
                    window.location.href = '../../pages/dashboard/index.html';
                });
            } else {
                alert('❌ Sai tài khoản hoặc mật khẩu');
            }
        })
        .catch(err => {
            console.error('❌ Lỗi khi đăng nhập:', err);
            alert('❌ Có lỗi xảy ra khi đăng nhập.');
        });
}

async function updateStreak(user) {
    const today = new Date().toDateString();
    const lastLogin = user.lastLoginDate || null;
    let streak = Number(user.streak) || 0;

    if (lastLogin) {
        const lastLoginDate = new Date(lastLogin);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastLoginDate.toDateString() === today) {
            // Already logged in today, do nothing
        } else if (lastLoginDate.toDateString() === yesterday.toDateString()) {
            // Consecutive day, increment streak
            streak += 1;
        } else {
            // Streak broken, reset to 1
            streak = 1;
        }
    } else {
        // First login, set streak to 1
        streak = 1;
    }

    const updatedUser = {
        ...user,
        streak: streak,
        lastLoginDate: today
    };

    try {
        const response = await fetch(`${apiUrl}/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to update user streak');
            return updatedUser;
        }
    } catch (err) {
        console.error('Error updating user streak:', err);
        return updatedUser;
    }
}
