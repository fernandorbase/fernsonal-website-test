let scrollProjectsContainer = document.querySelector(".slider-projects");
let scrollVlogsContainer = document.querySelector(".slider-vlogs");
let projectsBackButton = document.getElementById("projects-back-button");
let projectsNextButton = document.getElementById("projects-next-button");
let vlogsBackButton = document.getElementById("vlogs-back-button");
let vlogsNextButton = document.getElementById("vlogs-next-button");
const audio = document.getElementById("themeSong");
const toggleAudio = document.querySelector('.poster');

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

toggleAudio.addEventListener('click', () => {
if (audio.paused) {
    audio.play();
} else {
    audio.pause();
}
});

function addEntry() {
  const name = document.getElementById('name').value.trim();
  const country = document.getElementById('country').value.trim();
  const comment = document.getElementById('comment').value.trim();

  if (name && country && comment) {
      const newEntry = {
          name,
          country,
          comment,
          timestamp: Date.now()
      };
      firebase.database().ref("guestbook").push(newEntry);

      document.getElementById('name').value = '';
      document.getElementById('country').value = '';
      document.getElementById('comment').value = '';
  }
}

// Load entries from Firebase
firebase.database().ref("guestbook").on("child_added", function(snapshot) {
  const data = snapshot.val();
  const entryDiv = document.createElement('div');
  entryDiv.innerHTML = `<strong>${data.name} from ${data.country}:</strong> ${data.comment}<hr>`;
  document.getElementById('entries').prepend(entryDiv);
  document.querySelector('.guestbook-entries').style.display = 'block';
});
