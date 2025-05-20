const apiUrl = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users';

// Hàm đăng ký
function registerUser() {
    const userName = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const sourcesId = []

    if (!userName || !password) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }

    const newUser = {
        userName,
        password,
        sourcesId
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    })
        .then(res => res.json())
        .then(data => {
            alert('✅ Đăng ký thành công!');
            console.log('User created:', data);
            // Sau khi đăng ký có thể redirect hoặc xóa form
        })
        .catch(err => {
            console.error('❌ Lỗi khi đăng ký:', err);
            alert('❌ Có lỗi xảy ra khi đăng ký: ' + err);
        });
}

// Hàm đăng nhập
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
                // Lưu localStorage hoặc chuyển trang
                localStorage.setItem('userId', foundUser.id);
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
