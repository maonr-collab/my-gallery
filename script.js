let slides = [];
let currentIndex = 0;
const extendedCaptions = [
  {
    text: "כאן מופיע טקסט מורחב על פני 3 שקופיות, בעברית, עם אפקט מקצועי",
    startSlide: 0,
    endSlide: 2,
    style: {
      fontSize: "28px",
      color: "#FFD700",
      textShadow: "2px 2px 10px rgba(0,0,0,0.9)",
      background: "rgba(0,0,0,0.5)"
    }
  }
];

async function loadSlides() {
  const repo = "maonr-collab/my-gallery"; // שנה לשם המשתמש והרפו שלך
  const path = "assets";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  const res = await fetch(apiUrl);
  const files = await res.json();
  const container = document.getElementById("slideshow");

  files.forEach(file => {
    const ext = file.name.split('.').pop().toLowerCase();

    // כיתוב משם הקובץ (אם extendedCaption לא מוגדר)
    let name = file.name
                  .replace(/\.[^/.]+$/, '')
                  .replace(/_/g,' ')
                  .replace(/\b\w/g, c => c.toUpperCase());

    const slide = document.createElement("div");
    slide.className = "slide";

    let media;
    if (["jpg","jpeg","png","gif","webp"].includes(ext)) {
      media = document.createElement("img");
      media.src = file.download_url;
    } else if (["mp4","webm"].includes(ext)) {
      media = document.createElement("video");
      media.src = file.download_url;
      media.controls = true;
    } else if (ext === "pdf") {
      media = document.createElement("iframe");
      media.src = file.download_url;
    } else {
      return;
    }

    slide.appendChild(media);

    // כיתוב overlay
    const captionOverlay = document.createElement("div");
    captionOverlay.className = "caption";
    captionOverlay.textContent = name;
    slide.appendChild(captionOverlay);

    container.appendChild(slide);
    slides.push({element: slide, caption: name, captionOverlay});
  });

  if(slides.length) showSlide(0);
  setInterval(() => showSlide(currentIndex + 1), 6000);

  // הפעלת פסקול YouTube
  initYouTubeBackground("VIDEO_ID"); // הכנסי ID של שיר מיוטיוב
}

function showSlide(n) {
  if(slides.length === 0) return;
  slides[currentIndex].element.classList.remove("active");

  currentIndex = (n + slides.length) % slides.length;
  slides[currentIndex].element.classList.add("active");

  // בדיקה אם יש extended caption פעיל
  const extended = extendedCaptions.find(c => currentIndex >= c.startSlide && currentIndex <= c.endSlide);
  slides.forEach(s => s.captionOverlay.style.opacity = 0);
  if(extended) {
    slides[currentIndex].captionOverlay.textContent = extended.text;
    Object.assign(slides[currentIndex].captionOverlay.style, extended.style);
  } else {
    slides[currentIndex].captionOverlay.textContent = slides[currentIndex].caption;
    slides[currentIndex].captionOverlay.style = {};
  }
}

function nextSlide() { showSlide(currentIndex + 1); }
function prevSlide() { showSlide(currentIndex - 1); }

// YouTube Background
let player;
function initYouTubeBackground(videoId) {
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('yt-player', {
      height: '0',
      width: '0',
      videoId: videoId,
      playerVars: { autoplay: 1, controls: 0, loop: 0, rel:0 },
      events: { 'onReady': e => e.target.playVideo() }
    });
  };
}

// טעינת שקופיות
loadSlides();
