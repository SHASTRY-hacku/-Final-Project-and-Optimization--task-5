// Smooth hero CTA behaviour
function welcomeMessage(){
  alert("Welcome to VOLT-HUB! Happy Shopping 😊");
  document.querySelector("#products").scrollIntoView({behavior:"smooth"});
}

// NAVBAR solid on scroll
const navbar = document.querySelector('.navbar');
function handleNav(){
  if(window.scrollY > 40){
    navbar.classList.remove('transparent'); navbar.classList.add('solid');
  } else {
    navbar.classList.add('transparent'); navbar.classList.remove('solid');
  }
}
window.addEventListener('scroll', handleNav);
handleNav();

// ===== POLYFILLS & FALLBACKS =====

// Fetch polyfill for IE/old Edge (optional, external script is better)
if (!window.fetch) {
  const script = document.createElement("script");
  script.src = "https://polyfill.io/v3/polyfill.min.js?features=default,fetch";
  document.head.appendChild(script);
}

// IntersectionObserver fallback for Safari < 12, IE/old Edge
if (!("IntersectionObserver" in window)) {
  document.querySelectorAll(".fade-in").forEach(el => el.classList.add("appear"));
}

// Lazy loading fallback for Safari < 13
if (!("loading" in HTMLImageElement.prototype)) {
  document.querySelectorAll("img[loading='lazy']").forEach(img => {
    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  });
}


// Scroll-trigger animations
const faders = document.querySelectorAll('.fade-in');
const io = new IntersectionObserver((entries, obs)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('appear');
      obs.unobserve(entry.target);
    }
  });
},{threshold:0.2, rootMargin:"0px 0px -80px 0px"});
faders.forEach(el=>io.observe(el));

// CONTACT FORM VALIDATION
document.querySelector('.contact-form').addEventListener('submit', (e)=>{
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Simple email regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(name === ""){
    alert("⚠️ Please enter your name.");
    return;
  }

  if(email === "" || !emailPattern.test(email)){
    alert("⚠️ Please enter a valid email address.");
    return;
  }

  if(message === ""){
    alert("⚠️ Please enter your message.");
    return;
  }

  // If all checks pass
  alert("📩 Thank you! Your message has been sent.");
  e.target.reset();
});

// TO-DO LIST LOGIC with localStorage + completed tasks + counter
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const taskCounter = document.getElementById('taskCounter');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

// Add new task
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const taskText = todoInput.value.trim();
  if (taskText === "") return;

  tasks.push({ text: taskText, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));

  renderTasks();
  todoInput.value = "";
});

// Render tasks + counter
function renderTasks() {
  todoList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) {
      span.classList.add('todo-completed');
    }

    // Toggle complete on click
    span.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'todo-remove';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    todoList.appendChild(li);
  });

  // Update counter
  const activeCount = tasks.filter(task => !task.completed).length;
  taskCounter.textContent = `${activeCount} task${activeCount !== 1 ? "s" : ""} left`;
}

// CLEAR ALL COMPLETED
document.getElementById('clearCompleted').addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
});

// IMAGE GALLERY LOGIC with URL + File Upload
const galleryForm = document.getElementById('galleryForm');
const imageUrlInput = document.getElementById('imageUrl');
const imageFileInput = document.getElementById('imageFile');
const galleryGrid = document.getElementById('galleryGrid');

// Load from localStorage
let images = JSON.parse(localStorage.getItem('images')) || [];
renderGallery();

galleryForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const url = imageUrlInput.value.trim();
  const file = imageFileInput.files[0];

  if (url) {
    // Add image from URL
    images.push(url);
    localStorage.setItem('images', JSON.stringify(images));
    renderGallery();
    imageUrlInput.value = "";
  } else if (file) {
    // Add image from file upload
    const reader = new FileReader();
    reader.onload = function (event) {
      images.push(event.target.result); // Base64 encoded image
      localStorage.setItem('images', JSON.stringify(images));
      renderGallery();
    };
    reader.readAsDataURL(file);
    imageFileInput.value = "";
  } else {
    alert("⚠️ Please enter an image URL or upload a file.");
  }
});

// Render images
function renderGallery() {
  galleryGrid.innerHTML = "";
  images.forEach((src, index) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = src;
    img.alt = "Gallery Image";

    const removeBtn = document.createElement('button');
    removeBtn.className = 'gallery-remove';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      images.splice(index, 1);
      localStorage.setItem('images', JSON.stringify(images));
      renderGallery();
    });

    div.appendChild(img);
    div.appendChild(removeBtn);
    galleryGrid.appendChild(div);
  });
}

// IMAGE CAROUSEL LOGIC
const track = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextCarouselBtn = document.querySelector('.carousel-btn.next');
const slides = Array.from(track.children);
let index = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

nextCarouselBtn.addEventListener('click', () => {
  index = (index + 1) % slides.length;
  updateCarousel();
});

prevBtn.addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
});

// Auto-rotate every 5s
setInterval(() => {
  index = (index + 1) % slides.length;
  updateCarousel();
}, 5000);

// QUIZ LOGIC
const quizData = [
  {
    question: "Which device is known as the brain of the computer?",
    options: ["CPU", "Monitor", "Keyboard", "GPU"],
    answer: "CPU"
  },
  {
    question: "Which one is a wearable electronic device?",
    options: ["Refrigerator", "Smartwatch", "Microwave", "Router"],
    answer: "Smartwatch"
  },
  {
    question: "What does 4K in TVs refer to?",
    options: ["Screen Size", "Resolution", "Refresh Rate", "Color Depth"],
    answer: "Resolution"
  }
];

// Only run quiz logic if the quiz section exists
const quizContainer = document.getElementById("quizContainer");
const nextBtn = document.getElementById("nextBtn");
const quizResult = document.getElementById("quizResult");

if (quizContainer && nextBtn && quizResult) {
  let currentQuestion = 0;
  let score = 0;

  function loadQuestion() {
    const q = quizData[currentQuestion];
    quizContainer.innerHTML = `
      <div class="quiz-question">${q.question}</div>
      <div class="quiz-options">
        ${q.options.map(opt => `<button class="quiz-option">${opt}</button>`).join("")}
      </div>
    `;

    document.querySelectorAll(".quiz-option").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.textContent === q.answer) {
          score++;
          btn.style.background = "linear-gradient(135deg, #29c260, #1e9c4d)";
        } else {
          btn.style.background = "linear-gradient(135deg, #e53935, #b71c1c)";
        }
        document.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);
      });
    });
  }

  nextBtn.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      loadQuestion();
    } else {
      quizContainer.innerHTML = `<h3>You scored ${score} / ${quizData.length}</h3>`;
      nextBtn.style.display = "none";
      quizResult.textContent = "🎉 Great job completing the quiz!";
    }
  });

  // Load the first question
  loadQuestion();
}

// JOKE API FETCH
const jokeBtn = document.getElementById("jokeBtn");
const jokeText = document.getElementById("jokeText");

jokeBtn.addEventListener("click", async () => {
  jokeText.textContent = "Loading joke... 😂";

  try {
    const res = await fetch("https://official-joke-api.appspot.com/random_joke");
    const data = await res.json();
    jokeText.textContent = `${data.setup} — ${data.punchline}`;
  } catch (error) {
    jokeText.textContent = "⚠️ Failed to fetch a joke. Try again!";
  }
});

document.querySelector(".hamburger").addEventListener("click", ()=>{
  document.querySelector(".nav-links").classList.toggle("active");
});

// FILTER & SORT LOGIC
const ratingFilter = document.getElementById("ratingFilter");
const ratingValue = document.getElementById("ratingValue");

ratingFilter.addEventListener("input", () => {
  ratingValue.textContent = ratingFilter.value;
  applyFilters();
});

function applyFilters() {
  const category = document.getElementById("categoryFilter").value;
  const maxPrice = parseInt(document.getElementById("priceFilter").value) || Infinity;
  const minRating = parseFloat(ratingFilter.value);
  const sortOption = document.getElementById("sortSelect").value;

  // Filter products
  let filtered = products.filter(p => {
    const price = parseInt(p.getAttribute("data-price"));
    const cat = p.getAttribute("data-category");
    const rating = parseFloat(p.getAttribute("data-rating"));
    return (category === "all" || cat === category) && price <= maxPrice && rating >= minRating;
  });

  // Sort products
  filtered.sort((a, b) => {
    const priceA = parseInt(a.getAttribute("data-price"));
    const priceB = parseInt(b.getAttribute("data-price"));
    const nameA = a.querySelector("h3").textContent;
    const nameB = b.querySelector("h3").textContent;
    const ratingA = parseFloat(a.getAttribute("data-rating"));
    const ratingB = parseFloat(b.getAttribute("data-rating"));

    switch (sortOption) {
      case "lowHigh": return priceA - priceB;
      case "highLow": return priceB - priceA;
      case "nameAZ": return nameA.localeCompare(nameB);
      case "nameZA": return nameB.localeCompare(nameA);
      case "ratingHigh": return ratingB - ratingA;
      case "ratingLow": return ratingA - ratingB;
      default: return 0;
    }
  });

  // Clear grid and re-append
  productGrid.innerHTML = "";
  filtered.forEach(p => productGrid.appendChild(p));
}

// Auto-add visible ratings from data-rating
document.querySelectorAll('.product').forEach(p => {
  const rating = p.getAttribute('data-rating');
  if (rating) {
    const foot = p.querySelector('.product-foot');
    const ratingEl = document.createElement('span');
    ratingEl.className = 'rating';
    ratingEl.textContent = `⭐ ${rating}`;
    foot.insertBefore(ratingEl, foot.querySelector('.buyBtn'));
  }
});

// Smooth scroll polyfill
if (!("scrollBehavior" in document.documentElement.style)) {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView();
      }
    });
  });
}









