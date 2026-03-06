// Play music
const audio = document.getElementById("themeSong");
const toggleAudio = document.querySelector('.poster');
toggleAudio.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

// Browse projects and vlogs through slider
let scrollProjectsContainer = document.querySelector(".slider-projects");
let scrollVlogsContainer = document.querySelector(".slider-vlogs");
let projectsBackButton = document.getElementById("projects-back-button");
let projectsNextButton = document.getElementById("projects-next-button");
let vlogsBackButton = document.getElementById("vlogs-back-button");
let vlogsNextButton = document.getElementById("vlogs-next-button");

scrollProjectsContainer.addEventListener("wheel", (evt) => {
  evt.preventDefault();
  scrollProjectsContainer.scrollLeft += evt.deltaY;
});
projectsBackButton.addEventListener("click", () => {
  scrollProjectsContainer.style.scrollBehavior = "smooth";
  scrollProjectsContainer.scrollLeft -= 450;
});
projectsNextButton.addEventListener("click", () => {
  scrollProjectsContainer.style.scrollBehavior = "smooth";
  scrollProjectsContainer.scrollLeft += 450;
});

scrollVlogsContainer.addEventListener("wheel", (evt) => {
  evt.preventDefault();
  scrollVlogsContainer.scrollLeft += evt.deltaY;
});
vlogsBackButton.addEventListener("click", () => {
  scrollVlogsContainer.style.scrollBehavior = "smooth";
  scrollVlogsContainer.scrollLeft -= 450;
});
vlogsNextButton.addEventListener("click", () => {
  scrollVlogsContainer.style.scrollBehavior = "smooth";
  scrollVlogsContainer.scrollLeft += 450;
});

// Add mobile controls for marquee
const marquee = document.querySelector('.social-media-marquee');
if (marquee) {
  marquee.addEventListener('click', () => {
    marquee.classList.toggle('is-paused');
  });
}

// ─── SECURITY HELPERS ────────────────────────────────────────────────────────

// Strips HTML tags and encodes special characters to prevent XSS
function sanitizeInput(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Checks if the user has submitted within the last 60 seconds
function isRateLimited() {
  const lastSubmit = localStorage.getItem('lastGuestbookSubmit');
  const now = Date.now();
  if (lastSubmit && now - parseInt(lastSubmit) < 60000) {
    const secondsLeft = Math.ceil((60000 - (now - parseInt(lastSubmit))) / 1000);
    showFormFeedback(`Hold on par! Wait ${secondsLeft}s before submitting again. 🕐`, 'error');
    return true;
  }
  return false;
}

// Displays a temporary status message near the submit button
function showFormFeedback(message, type = 'success') {
  let feedback = document.getElementById('form-feedback');
  if (!feedback) {
    feedback = document.createElement('p');
    feedback.id = 'form-feedback';
    document.getElementById('button-submit').insertAdjacentElement('afterend', feedback);
  }
  feedback.textContent = message;
  feedback.style.color = type === 'error' ? '#ff4d4d' : '#4dff91';
  feedback.style.fontFamily = 'inherit';
  feedback.style.marginTop = '8px';
  clearTimeout(feedback._timeout);
  feedback._timeout = setTimeout(() => feedback.textContent = '', 4000);
}

// ─── ADD GUESTBOOK ENTRY ─────────────────────────────────────────────────────

function addEntry() {
  const rawName    = document.getElementById('name').value.trim();
  const rawCountry = document.getElementById('country').value.trim();
  const rawComment = document.getElementById('comment').value.trim();

  // 1. Check all fields are filled
  if (!rawName || !rawCountry || !rawComment) {
    showFormFeedback('Please fill out all fields, par! 📝', 'error');
    return;
  }

  // 2. Length validation (mirrors Firebase rules)
  if (rawName.length > 50) {
    showFormFeedback('Name must be 50 characters or less.', 'error');
    return;
  }
  if (rawCountry.length > 50) {
    showFormFeedback('Country must be 50 characters or less.', 'error');
    return;
  }
  if (rawComment.length > 500) {
    showFormFeedback(`Comment too long! ${rawComment.length}/500 characters.`, 'error');
    return;
  }

  // 3. Rate limiting — prevents spam submissions
  if (isRateLimited()) return;

  // 4. Sanitize inputs before sending to Firebase
  const name    = sanitizeInput(rawName);
  const country = sanitizeInput(rawCountry);
  const comment = sanitizeInput(rawComment);

  // 5. Push to Firebase with server-side timestamp
  database.ref("guestbook").push({
    name,
    country,
    comment,
    timestamp: firebase.database.ServerValue.TIMESTAMP  // tamper-proof server time
  })
  .then(() => {
    // Record submission time for rate limiting
    localStorage.setItem('lastGuestbookSubmit', Date.now().toString());

    // Reset form
    document.getElementById('name').value = '';
    document.getElementById('country').value = '';
    document.getElementById('comment').value = '';

    showFormFeedback('Entry submitted! Salamat par! 🎉', 'success');
  })
  .catch((error) => {
    console.error('Firebase write error:', error);
    showFormFeedback('Something went wrong. Try again later!', 'error');
  });
}

// ─── SHOW ENTRIES ─────────────────────────────────────────────────────────────

database.ref("guestbook").on("child_added", function(snapshot) {
  const data = snapshot.val();

  // Sanitize data coming FROM Firebase before rendering it in the DOM
  const safeName    = sanitizeInput(data.name    || '');
  const safeCountry = sanitizeInput(data.country || '');
  const safeComment = sanitizeInput(data.comment || '');

  // Preserve line breaks safely (after sanitizing, not before)
  const formattedComment = safeComment.replace(/\n/g, "<br>");
  const timestamp = new Date(data.timestamp).toLocaleString();

  const entryDiv = document.createElement('div');
  entryDiv.classList.add('chat-bubble', 'pop-in');

  // Use textContent for name/country, innerHTML only for pre-sanitized comment
  const header = document.createElement('div');
  header.classList.add('bubble-header');

  const strong = document.createElement('strong');
  strong.textContent = `${safeName} from ${safeCountry}`;

  const span = document.createElement('span');
  span.classList.add('timestamp');
  span.textContent = timestamp;

  header.appendChild(strong);
  header.appendChild(span);

  const body = document.createElement('div');
  body.classList.add('bubble-body');
  body.innerHTML = formattedComment; // safe — already sanitized above

  entryDiv.appendChild(header);
  entryDiv.appendChild(body);

  document.getElementById('entries').prepend(entryDiv);
  document.querySelector('.guestbook-entries').style.display = 'block';
});
