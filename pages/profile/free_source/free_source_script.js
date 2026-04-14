document.addEventListener('DOMContentLoaded', () => {
    const speakBtn = document.querySelector('.toSpeak');
    const typingBtn = document.querySelector('.toTyping');

    if (speakBtn) {
        speakBtn.addEventListener('click', () => {
            window.location.href = 'speak/speak.html';
        });
    }

    if (typingBtn) {
        typingBtn.addEventListener('click', () => {
            window.location.href = 'typing/typing.html';
        });
    }
});
