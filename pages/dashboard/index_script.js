document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const loginContainer = document.querySelector('.login');

    if (user && loginContainer) {
        const userName = user.userName;

        loginContainer.innerHTML = `
            <div class="relative inline-block text-left">
                <button id="userDropdownButton" class="text-white font-semibold px-4 py-2 bg-green-600 rounded hover:bg-green-700">
                    Hello, ${userName} ▼
                </button>
                <div id="userDropdownMenu" class="hidden absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
                    <button id="logoutBtn" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đăng xuất</button>
                </div>
            </div>
        `;

        // Toggle dropdown
        const button = document.getElementById('userDropdownButton');
        const menu = document.getElementById('userDropdownMenu');
        button.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // Đăng xuất
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            location.reload(); // hoặc chuyển về login.html
        });
    }
});