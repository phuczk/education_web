// Go back function
function goBack() {
    window.location.href = '../free_source.html';
}

// Flashcard item element (read-only mode - no delete button)
const flashcard_item = $(`<div class="card">
<div class="card-container">
    <div class="card-front">
        <h4 class="card-front-title dynapuff-font">Question</h4>
        <img class="card-image" src="" alt="Flashcard image">
        <div class="card-front-text dynapuff-font">Sample only 123</div>
        <button class="audio-btn">
            <span class="material-symbols-outlined">volume_up</span>
        </button>
        <!-- Delete button hidden for read-only mode -->
        </div>
    <div class="card-back">
        <h4 class="card-back-title dynapuff-font">Answer</h4>
        <div class="card-back-text dynapuff-font">Sample only 123</div>
    </div>
</div>
</div>`)

// Flashcard Items Container
const flashcardContainer = $(`.flashcards`)
// Flashcard Form Modal
const flashcardModal = $(`#form-modal`)
// Flashcard Form
const FCForm = $(`#flashcard-form`)
// New Flashcard Item Button
const newFCButton = $(`#btn-new-flashcard`)
// Flashcard Modal Close Button
const FCCloseButton = $(`#form-modal .form-modal-close`)
// Navigation buttons
const prevButton = $(`#btn-prev-flashcard`)
const nextButton = $(`#btn-next-flashcard`)
// API URL for flashcard data
const API_URL = "https://682dcaf54fae1889475791ed.mockapi.io/api/v2/speaklearn/word";
// Stored Flashcard Data from API
var FCData = [];
// Current flashcard index
var currentIndex = 0;
// Shuffled flashcard data
var shuffledFCData = [];

// New Flashcard Button Click Event Listener (disabled for read-only API mode)
newFCButton.click(function (e) {
    e.preventDefault();
    // Button is hidden, but just in case
    return false;
})

// Flashcard Modal Close Button Click Event Listener (disabled for read-only API mode)
FCCloseButton.click(function (e) {
    e.preventDefault()
    if (flashcardModal.hasClass("shown"))
        flashcardModal.removeClass("shown");
})

// Shuffle algorithm using Fisher-Yates shuffle
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Load Flashcard Data from API
async function loadFlashcardsFromAPI() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        // Map API data to flashcard format
        FCData = data.map(item => ({
            id: item.id,
            question: item.front,
            answer: item.back,
            image: item.image,
            audio: item.audio
        }));
        // Shuffle the flashcards
        shuffledFCData = shuffleArray(FCData);
        currentIndex = 0;
        console.log('Loaded and shuffled flashcards from API:', shuffledFCData);
        load_flashcards();
    } catch (error) {
        console.error("Error loading flashcards from API:", error);
        // Fallback to empty data
        FCData = [];
        shuffledFCData = [];
        load_flashcards();
    }
}

// Generate New Flashcard Item ID
function generateNewID() {
    var id = 0;
    if (FCData.length > 0) {
        for (var i = 0; i < FCData.length; i++) {
            if (id < FCData[i].id) {
                id = FCData[i].id;
            }
        }
    }
    id++;
    return id;
}
 
// New Flashcard submit event (disabled for API mode - read-only)
FCForm.submit(function (e) {
    e.preventDefault();
    alert('Flashcards are loaded from API. Add/Edit functionality is disabled in read-only mode.');
    flashcardModal.removeClass("shown");
})
 
// Load Flashcard Items (single card display)
function load_flashcards(animationDirection = 'right') {
    flashcardContainer.html("")
    
    if (shuffledFCData.length === 0) {
        flashcardContainer.html("<p>No flashcards available</p>")
        updateNavigationButtons()
        return
    }
    
    // Display only current flashcard
    const data = shuffledFCData[currentIndex]
    const fc_item = flashcard_item.clone(true)
    fc_item.find(`.card-front-text`).text(data.question)
    fc_item.find(`.card-back-text`).text(data.answer)
    fc_item[0].dataset.id = data.id
    
    // Set image
    if (data.image) {
        fc_item.find('.card-image').attr('src', data.image.trim())
    }
    
    // Set audio button
    const audioBtn = fc_item.find('.audio-btn')
    if (data.audio) {
        audioBtn.click(function(e) {
            e.stopPropagation()
            const audio = new Audio(data.audio.trim())
            audio.play()
        })
    } else {
        audioBtn.hide()
    }
    
    // Add animation class based on direction
    if (animationDirection === 'left') {
        fc_item.addClass('slide-left')
    } else {
        fc_item.addClass('slide-right')
    }
    
    flashcardContainer.append(fc_item)
    
    // Add flip event
    fc_item.click(function (e) {
        e.preventDefault()
        if ($(this).hasClass("active")) {
            $(this).removeClass("active")
        } else {
            $(this).addClass("active")
            
            // Update daily quest progress for flashcard practice
            updateFlashcardQuestProgress();
        }
    })
    
    // Function to update flashcard quest progress
    function updateFlashcardQuestProgress() {
        const savedQuests = JSON.parse(localStorage.getItem('dailyQuests') || '{}');
        const questData = savedQuests['practice_flashcard'] || { progress: 0, claimed: false };
        
        if (!questData.claimed) {
            questData.progress = Math.min(questData.progress + 1, 10); // Track cards viewed
            savedQuests['practice_flashcard'] = questData;
            localStorage.setItem('dailyQuests', JSON.stringify(savedQuests));
            
            // Show notification for quest progress
            showFlashcardQuestNotification();
        }
    }
    
    function showFlashcardQuestNotification() {
        const notification = $('<div>')
            .css({
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'linear-gradient(45deg, #ff69b4, #ff1493)',
                color: 'white',
                padding: '12px 18px',
                borderRadius: '20px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
                zIndex: '1000',
                animation: 'slideIn 0.3s ease'
            })
            .text('🎴 Flashcard quest progress!');
        
        $('body').append(notification);
        
        setTimeout(() => {
            notification.css('animation', 'slideIn 0.3s ease reverse');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
    
    updateNavigationButtons()
}

// Update navigation buttons state and card counter
function updateNavigationButtons() {
    if (shuffledFCData.length === 0) {
        prevButton.prop('disabled', true)
        nextButton.prop('disabled', true)
        $('#current-card').text('0')
        $('#total-cards').text('0')
        return
    }
    
    prevButton.prop('disabled', currentIndex === 0)
    nextButton.prop('disabled', currentIndex === shuffledFCData.length - 1)
    
    // Update card counter
    $('#current-card').text(currentIndex + 1)
    $('#total-cards').text(shuffledFCData.length)
}

// Show previous flashcard
function showPreviousFlashcard() {
    if (currentIndex > 0) {
        currentIndex--
        load_flashcards('left')
    }
}

// Show next flashcard
function showNextFlashcard() {
    if (currentIndex < shuffledFCData.length - 1) {
        currentIndex++
        load_flashcards('right')
    }
}

prevButton.click(showPreviousFlashcard)
nextButton.click(showNextFlashcard)

$(document).ready(function () {
    // Load flashcards from API
    loadFlashcardsFromAPI();
})