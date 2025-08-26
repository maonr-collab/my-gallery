let slides = [];
let currentIndex = 0;

async function loadSlides() {
  const repo = "maonr-collab/my-gallery"; // ← שנה לשם המשתמש והרפו שלך
  const path = "assets";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;

  const res = await fetch(apiUrl);
  const files = await res.json();
  const container = document.getElementById("slideshow");
  const captionEl = document.getElementById("caption");

  files.forEach(file => {
    const ext = file.name.split('.').pop().toLowerCase();

    // כיתוב מורחב בעברית
    let name = file.name
                  .replace(/\.[^/.]+$/, '')  // הסרת סיומת
                  .replace(/_/g,' ')          // _ → רווח
                  .replace(/\b\w/g, c => c.toUpperCase()); // אותיות ראשונות גדולות

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

    // יצירת overlay עם טקסט מורחב
    const captionOverlay = document.createElement("div");
    captionOverlay.className = "caption";
    captionOverlay.textContent = name;
    slide.appendChild(captionOverlay);

    container.appendChild(slide);
    slides.push({element: slide, caption: name});
  });

  if(slides.length) showSlide(0);
  setInterval(() => showSlide(currentIndex + 1), 6000);
}

function showSlide(n) {
  if(slides.length === 0) return;
  slides[currentIndex].element.classList.remove("active");

  currentIndex = (n + slides.length) % slides.length;
  slides[currentIndex].element.classList.add("active");

  document.getElementById("caption").textContent = slides[currentIndex].caption;
}

function nextSlide() { showSlide(currentIndex + 1); }
function prevSlide() { showSlide(currentIndex - 1); }

loadSlides();
