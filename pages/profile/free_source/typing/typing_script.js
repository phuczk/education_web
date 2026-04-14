const API_URL = "https://682dcaf54fae1889475791ed.mockapi.io/api/v2/speaklearn/word";
let wordsFromAPI = [];
let unusedWords = [];
let lastWord = "";
let wordUsage = {};

async function loadWords() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        wordsFromAPI = data.map(item => item.word);
        wordUsage = {};
        wordsFromAPI.forEach(word => wordUsage[word] = 0);
        ranDomContent();
    } catch (error) {
        console.error("Lỗi API:", error);
        wordsFromAPI = ["Lỗi kết nối", "Vui lòng kiểm tra"];
        wordUsage = {};
        wordsFromAPI.forEach(word => wordUsage[word] = 0);
        ranDomContent();
    }
}

function ranDomContent() {
    clearInterval(time);
    
    timeLeft = maxTime;
    charIndex = mistake = isTyping = streak = 0;
    inputFeild.value = "";
    
    timeTag.innerText = timeLeft;
    mistake_p.innerText = mistake;
    wpmTag.innerText = 0;
    cpmTag.innerText = 0;
    streakTag.innerText = streak;

    typingText.innerHTML = "";
    const list = wordsFromAPI.length > 0 ? wordsFromAPI : ["Loading..."];
    const availableWords = list.filter(word => wordUsage[word] < 2);
    let selectedWord;

    if (availableWords.length === 0) {
        Object.keys(wordUsage).forEach(word => wordUsage[word] = 0);
        selectedWord = list[Math.floor(Math.random() * list.length)];
    } else {
        const candidates = availableWords.filter(word => word !== lastWord);
        if (candidates.length > 0) {
            selectedWord = candidates[Math.floor(Math.random() * candidates.length)];
        } else {
            selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        }
    }

    if (!wordUsage[selectedWord]) {
        wordUsage[selectedWord] = 0;
    }
    wordUsage[selectedWord] += 1;
    lastWord = selectedWord;

    selectedWord.split("").forEach(span => {
        let spanTag = `<span>${span}</span>`;
        typingText.innerHTML += spanTag;
    });

    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", () => inputFeild.focus());
    typingText.addEventListener("click", () => inputFeild.focus());
}

loadWords();

var buttons = document.getElementsByClassName("calc-button");

document.addEventListener("keydown", function(event) {
  var key = event.key.toLowerCase();
  if (key === " ") key = "space";
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    if (button.getAttribute("data-key") === key) {
      button.classList.add("pressed");
    }
  }
});

document.addEventListener("keyup", function(event) {
  var key = event.key.toLowerCase();
  if (key === " ") key = "space";
  for (var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    if (button.getAttribute("data-key") === key) {
      button.classList.remove("pressed");
    }
  }
});

const typingText = document.getElementById("typing-text_p")
let charIndex = 0;
console.log(typingText);
inputFeild = document.querySelector(".wrapper .input-field");

let mistake = 0;
let isTyping = 0;
let streak = 0;
timeTag = document.querySelector('.time span b');
wpmTag = document.querySelector('.wpm span b');
cpmTag = document.querySelector('.cpm span b');
streakTag = document.querySelector('.streak span b');
let time, maxTime = 30, timeLeft = maxTime;
let wpm = cpm = 0;

function initTyping() {
    const characters = typingText.querySelectorAll("span");
    let typedChar = inputFeild.value.split("")[charIndex];

    if (!isTyping) {
        time = setInterval(initTimer, 1000);
        isTyping = true;
    }

    if (typedChar == null) {
        if (charIndex > 0) {
            charIndex--;
            if (characters[charIndex].classList.contains("incorrect")) {
                mistake--;
            }
            characters[charIndex].classList.remove("correct", "incorrect");
            streak = 0;
        }
    } else {
        if (charIndex < characters.length) {
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
                streak++;
            } else {
                characters[charIndex].classList.add("incorrect");
                mistake++;
                streak = 0;
            }
            charIndex++;
        }
    }

    characters.forEach(span => span.classList.remove("active"));
    if (charIndex < characters.length) {
        characters[charIndex].classList.add("active");
    } else {
        setTimeout(() => {
            ranDomContent();
        }, 500);
    }

    document.getElementById("mistake_p").innerHTML = mistake;
    streakTag.innerHTML = streak;
    cpm = charIndex - mistake;
    cpmTag.innerHTML = cpm;
    
    let wpm = Math.round(((charIndex - mistake) / 5) / ((maxTime - timeLeft) / 60));
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    wpmTag.innerHTML = wpm;
}

function initTimer(){
  if(timeLeft > 0){
    timeLeft--;
    timeTag.innerText = timeLeft;
  }else{
    clearInterval(time);
  }
}
ranDomContent();
inputFeild.addEventListener("input", initTyping);
