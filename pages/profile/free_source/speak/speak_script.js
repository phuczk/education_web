const API_URL = "https://682dcaf54fae1889475791ed.mockapi.io/api/v2/speaklearn/word";
let currentTargetWord = "chào";

const recordBtn = document.getElementById("recordBtn");
const nextBtn = document.getElementById("nextBtn");
const output = document.getElementById("output");
const result = document.getElementById("result");
const targetDisplay = document.getElementById("targetDisplay").querySelector("span");
const targetWord = "chào";

targetDisplay.textContent = targetWord;

async function fetchNewWord() {
  try {
    nextBtn.disabled = true;
    targetDisplay.textContent = "Đang tải...";

    const response = await fetch(API_URL);
    const data = await response.json();

    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      const selectedData = data[randomIndex];

      currentTargetWord = selectedData.word;
      targetDisplay.textContent = currentTargetWord;

      output.textContent = "...";
      result.textContent = "Kết quả:";
      result.style.color = "black";
      updateProgressCircle(0);
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu:", error);
    targetDisplay.textContent = "Lỗi tải từ!";
  } finally {
    nextBtn.disabled = false;
  }
}

fetchNewWord();

nextBtn.onclick = () => {
  if (isRecording) {
    stopRecording();
  }
  fetchNewWord();
};

let recognition;
let isRecording = false;
let silenceTimer;
let finalTranscript = "";
let lastInterim = "";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    console.log("✅ recognition started");
  };

  recognition.onend = () => {
    console.log("🛑 recognition ended");
    if (isRecording) {
      try {
        setTimeout(() => {
          console.log("↺ restarting recognition because isRecording === true");
          recognition.start();
        }, 100);
      } catch (err) {
        console.error("Failed to restart recognition:", err);
        stopRecording();
      }
    }
  };

  recognition.onspeechstart = () => {
    console.log("🗣️ speech detected");
  };

  recognition.onspeechend = () => {
    console.log("🤫 speech ended (silence detected)");
  };

  recognition.onresult = (event) => {
    if (!isRecording) return;
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript + " ";
      } else {
        interim += transcript;
      }
    }
    lastInterim = interim;
    const full = (finalTranscript + interim).trim().toLowerCase();
    console.log("onresult -> full:", full);
    output.textContent = full || "…";
    resetSilenceTimer();
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    if (event.error === "not-allowed" || event.error === "permission-denied") {
      result.textContent = "⚠️ Trình duyệt chặn quyền Micro. Vui lòng cho phép micro cho trang này.";
      result.style.color = "red";
      stopRecording();
      return;
    }
    stopRecording();
  };
} else {
  alert("Trình duyệt của bạn không hỗ trợ Web Speech API 😢 — hãy dùng Chrome/Edge mới nhất.");
}

recordBtn.onclick = () => {
  if (!isRecording) startRecording();
  else stopRecording();
};

const startRecording = () => {
  if (!recognition) {
    alert("SpeechRecognition không khả dụng trên trình duyệt này.");
    return;
  }

  isRecording = true;
  recordBtn.textContent = "🛑 Đang ghi...";
  recordBtn.classList.add("recording");
  output.textContent = "Đang lắng nghe... 👂";
  result.textContent = "";
  finalTranscript = "";
  lastInterim = "";

  try {
    recognition.start();
    resetSilenceTimer();
  } catch (err) {
    console.error("Error calling recognition.start():", err);
    result.textContent = "⚠️ Không thể bắt đầu nhận diện. Kiểm tra quyền micro và reload trang.";
    result.style.color = "red";
    isRecording = false;
    recordBtn.textContent = "Bấm để nói";
    recordBtn.classList.remove("recording");
  }
};

const stopRecording = () => {
  if (!isRecording) return;
  isRecording = false;
  recordBtn.textContent = "Bấm để nói";
  recordBtn.classList.remove("recording");

  try {
    recognition.stop();
  } catch (err) {
    console.warn("recognition.stop() error:", err);
  }

  clearTimeout(silenceTimer);

  if (!finalTranscript.trim() && lastInterim.trim()) {
    finalTranscript = lastInterim;
  }
  checkResult();
};

const resetSilenceTimer = () => {
  clearTimeout(silenceTimer);
  silenceTimer = setTimeout(() => {
    console.log("Silence timer fired -> stopRecording()");
    stopRecording();
  }, 3000);
};

const highlightDifference = (target, said) => {
  const targetWords = target.split(" ");
  const saidWords = said.split(" ");
  const resultHtml = [];

  const len = Math.max(targetWords.length, saidWords.length);

  for (let i = 0; i < len; i++) {
    const t = targetWords[i];
    const s = saidWords[i];

    if (t && s) {
      const maxLen = Math.max(t.length, s.length);
      let wordHtml = "";
      for (let j = 0; j < maxLen; j++) {
        const tc = t[j];
        const sc = s[j];
        if (tc && sc) {
          wordHtml += `<span class="${tc === sc ? "correct" : "incorrect"}">${sc}</span>`;
        } else if (sc && !tc) {
          wordHtml += `<span class="extra">${sc}</span>`;
        } else if (tc && !sc) {
          wordHtml += `<span class="missing">${tc}</span>`;
        }
      }
      resultHtml.push(wordHtml);
    } else if (!t && s) {
      resultHtml.push(`<span class="extra">${s}</span>`);
    } else if (t && !s) {
      resultHtml.push(`<span class="missing">${t}</span>`);
    }
  }

  return resultHtml.join(" ");
};

const checkResult = () => {
  const cleanTranscript = (finalTranscript || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,!?]/g, "")
    .trim()
    .toLowerCase();

  const cleanTarget = (currentTargetWord || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  console.log("checkResult -> finalTranscript:", finalTranscript, "cleanTranscript:", cleanTranscript);

  const highlighted = highlightDifference(cleanTarget, cleanTranscript);
  output.innerHTML = highlighted || "<i>Không nhận dạng được văn bản.</i>";

  if (!cleanTranscript) {
    result.textContent = "❌ Chưa nghe được văn bản (vui lòng thử lại).";
    result.style.color = "red";
    updateProgressCircle(0);
    return;
  }

  const accuracy = calculateAccuracy(cleanTarget, cleanTranscript);

  if (accuracy === 100) {
    if (cleanTranscript === cleanTarget) {
      result.textContent = "✅ Chính xác! Bạn đã nói đúng từ.";
      result.style.color = "green";
      updateProgressCircle(accuracy, "green");
    } else {
      result.textContent = "🟡 Gần chính xác (bạn nói thêm hoặc thiếu chữ).";
      result.style.color = "orange";
      updateProgressCircle(accuracy, "yellow");
    }
  } else {
    result.textContent = `🔹 Độ chính xác: ${accuracy.toFixed(1)}%`;
    result.style.color = "orange";
    updateProgressCircle(accuracy, "yellow");
  }
};

const calculateAccuracy = (target, said) => {
  if (!target) return 0;
  try {
    const segmenter = new Intl.Segmenter("vi", { granularity: "grapheme" });
    const targetChars = Array.from(segmenter.segment(target), seg => seg.segment);
    const saidChars = Array.from(segmenter.segment(said || ""), seg => seg.segment);

    let correct = 0;
    const len = Math.max(targetChars.length, saidChars.length);

    for (let i = 0; i < len; i++) {
      if (targetChars[i] === saidChars[i]) correct++;
    }

    return Math.round((correct / targetChars.length) * 100);
  } catch (err) {
    let correct = 0;
    for (let i = 0; i < target.length; i++) {
      if (said[i] === target[i]) correct++;
    }
    return Math.round((correct / Math.max(1, target.length)) * 100);
  }
};

const updateProgressCircle = (percent, mode = "auto") => {
  const circle = document.getElementById("progressCircle");
  const percentText = document.getElementById("accuracy");
  const circumference = 314;
  const offset = circumference - (percent / 100) * circumference;
  if (circle) circle.style.strokeDashoffset = offset;
  if (percentText) percentText.textContent = `${percent}%`;

  let color;
  if (mode === "green") color = "#2ecc71";
  else if (mode === "yellow") color = "#f1c40f";
  else if (mode === "red") color = "#e74c3c";
  else {
    if (percent >= 80) color = "#2ecc71";
    else if (percent >= 50) color = "#f1c40f";
    else if (percent >= 30) color = "#f1750fff";
    else color = "#e74c3c";
  }

  if (circle) circle.style.stroke = color;
  if (percentText) percentText.style.color = color;
};

const setLanguage = (lang) => {
  if (recognition) {
    const wasRecording = isRecording;
    if (wasRecording) stopRecording();
    recognition.lang = lang;
    console.log("Language set to", lang);
    if (wasRecording) startRecording();
  }
};
