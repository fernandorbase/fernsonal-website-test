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

scrollProjectsContainer.addEventListener("wheel", (evt)=>{
    evt.preventDefault();
    scrollProjectsContainer.scrollLeft += evt.deltaY;
  });

projectsBackButton.addEventListener("click", ()=>{
    scrollProjectsContainer.style.scrollBehavior = "smooth";
    scrollProjectsContainer.scrollLeft -= 450;
  });

projectsNextButton.addEventListener("click", ()=>{
    scrollProjectsContainer.style.scrollBehavior = "smooth";
    scrollProjectsContainer.scrollLeft += 450;
  });

scrollVlogsContainer.addEventListener("wheel", (evt)=>{
    evt.preventDefault();
    scrollVlogsContainer.scrollLeft += evt.deltaY;
  });

vlogsBackButton.addEventListener("click", ()=>{
    scrollVlogsContainer.style.scrollBehavior = "smooth";
    scrollVlogsContainer.scrollLeft -= 450;
  });

vlogsNextButton.addEventListener("click", ()=>{
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

// Add guestbook entry
function addEntry() {
  const name = document.getElementById('name').value.trim();
  const country = document.getElementById('country').value.trim();
  const comment = document.getElementById('comment').value.trim();

  if (name && country && comment) {
    database.ref("guestbook").push({
      name,
      country,
      comment,
      timestamp: Date.now()
    });

    // Reset form
    document.getElementById('name').value = '';
    document.getElementById('country').value = '';
    document.getElementById('comment').value = '';
  }
}

// Show entries
database.ref("guestbook").on("child_added", function(snapshot) {
  const data = snapshot.val();

  const formattedComment = data.comment.replace(/\n/g, "<br>");
  const timestamp = new Date(data.timestamp).toLocaleString();

  const entryDiv = document.createElement('div');
  entryDiv.classList.add('chat-bubble', 'pop-in');
  entryDiv.innerHTML = `
    <div class="bubble-header">
      <strong>${data.name} from ${data.country}</strong>
      <span class="timestamp">${timestamp}</span>
    </div>
    <div class="bubble-body">${formattedComment}</div>
  `;

  document.getElementById('entries').prepend(entryDiv);
  document.querySelector('.guestbook-entries').style.display = 'block';
});

