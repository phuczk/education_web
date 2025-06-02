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
                sourcesId
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
                alert('✅ Đăng nhập thành công!');
                console.log('Logged in user:', foundUser);
                localStorage.setItem('userId', foundUser.id);
                localStorage.setItem('user', JSON.stringify(foundUser));
                window.location.href = '../../pages/dashboard/index.html';
            } else {
                alert('❌ Sai tài khoản hoặc mật khẩu');
            }
        })
        .catch(err => {
            console.error('❌ Lỗi khi đăng nhập:', err);
            alert('❌ Có lỗi xảy ra khi đăng nhập.');
        });
}
