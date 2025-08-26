let slideIndex = 0;
let slides = [];

// נטען את רשימת הקבצים מתוך GitHub Repo
async function loadGallery() {
  const repo = "USERNAME/REPO_NAME"; // ← לשנות לשם המשתמש/הרפו שלך
  const path = "assets";

  // פניה ל-GitHub API
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`);
  const files = await res.json();

  const gallery = document.getElementById("gallery");

  files.forEach(file => {
    let ext = file.name.split('.').pop().toLowerCase();
    let slide = document.createElement("div");
    slide.classList.add("slide");

    let media;
    if (["jpg","jpeg","png","gif","webp"].includes(ext)) {
      media = document.createElement("img");
      media.src = file.download_url;
    } else if (["mp4","webm"].includes(ext)) {
      media = document.createElement("video");
      media.src = file.download_url;
      media.controls = true;
    } else if (["pdf"].includes(ext)) {
      media = document.createElement("iframe");
      media.src = file.download_url;
    }

    if (media) {
      slide.appendChild(media);
      gallery.appendChild(slide);
      slides.push({element: slide, caption: file.name});
    }
  });

  showSlides();
}

function showSlides() {
  slides.forEach(s => s.element.style.display = "none");
  slideIndex++;
  if (slideIndex > slides.length) slideIndex = 1;

  let current = slides[slideIndex - 1];
  current.element.style.display = "block";
  document.getElementById("caption").textContent = current.caption;

  setTimeout(showSlides, 4000); // מעבר כל 4 שניות
}

loadGallery();
