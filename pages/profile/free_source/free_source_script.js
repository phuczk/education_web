document.addEventListener('DOMContentLoaded', () => {
    const flashcardBtn = document.querySelector('.toFlashcard');
    const speakBtn = document.querySelector('.toSpeak');
    const speakTestBtn = document.querySelector('.toSpeakTest');
    const typingBtn = document.querySelector('.toTyping');

    if (flashcardBtn) {
        flashcardBtn.addEventListener('click', () => {
            window.location.href = 'flash_card/index.html';
        });
    }

    if (speakTestBtn) {
        speakTestBtn.addEventListener('click', () => {
            window.location.href = 'speak_test/speak.html';
        });
    }

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
