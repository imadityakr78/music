const songDetails = {
      "somewhere.mp3": { name: "Somewhere Only We Know", artist: "Keane" },
      "itni-si-hasi.mp3": { name: "Itni Si Hasi", artist: "Shreya Ghoshal" },
      "appocylispe.mp3": { name: "Appocalypse", artist: "Cigarettes After Sex" },
      "hawayein.mp3": { name: "Hawayein", artist: "Arijit Singh" },
      "tu-meri-dost=hai.mp3": { name: "Tu Meri Dost Hai", artist: "Benny Dayal" },
      "dildara.mp3": { name: "Dildaara", artist: "Shafqat Amanat Ali" },
      "fairlytale.mp3": { name: "Fairytale", artist: "Alexander Rybak" },
      "har-kisi-ko.mp3": { name: "Har Kisi Ko", artist: "Arijit Singh" },
      "maahi.mp3": { name: "Maahi", artist: "Tose Naina" },
      "sunsetz.mp3": { name: "Sunsetz", artist: "Cigarettes After Sex" },
      "raaz.mp3": { name: "Raaz Aankhein Teri", artist: "Arijit Singh" },
      "khamoshiyan.mp3": { name: "Khamoshiyan", artist: "Arijit Singh" }

    }
    const audio = new Audio()
    let currentsong = ""
    let isplaying = false
    let currentIndex = 0

    const cards = document.querySelectorAll(".card")
    const songs = Array.from(cards).map(card => card.getAttribute("data-src"))
    const playpauseBtn = document.querySelectorAll(".playpause-button");
    const seekbars = document.querySelectorAll(".seekbar")
    const currentime = document.querySelector(".currentime")
    const totaltime = document.querySelector(".totaltime")
    const songname = document.querySelectorAll(".songname")
    const artistname = document.querySelectorAll(".artistname")
    const songimg = document.querySelectorAll(".playerimg img")
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const closebtn = document.getElementById('closebtn');
    const overlay = document.getElementById('overlay');


    cards.forEach((card, Index) => {
      card.addEventListener("click", () => {
        const src = card.getAttribute("data-src")
        if (src !== currentsong) {
          currentIndex = Index
          playaudio(src);
          currentsong = src;
        }

      })
    });

    playpauseBtn.forEach(btn => {
      btn.addEventListener("click", () => {
        if (isplaying) {
          audio.pause();
          isplaying = false;
          updatePlayIcons();
        } else {
          audio.play();
          isplaying = true;
          updatePauseIcons();
        }
      });
    });
    document.querySelectorAll(".next-button").forEach(el=>el.addEventListener("click", () => {
      playnextsong()
    }))
    document.querySelectorAll(".previous-button").forEach(el=>el.addEventListener("click", () => {
      playpreviousong()
    }))

    function playnextsong() {
      currentIndex = (currentIndex + 1) % songs.length
      const nextsong = songs[currentIndex]
      playaudio(nextsong)
      currentsong = nextsong
    }

    function playpreviousong() {
      currentIndex = (currentIndex - 1 + songs.length) % songs.length
      const previousong = songs[currentIndex]
      playaudio(previousong)
      currentsong = previousong
    }

    const playaudio = (src) => {
      songname.forEach(el => el.innerText = songDetails[src].name)
      artistname.forEach(el => el.innerText = songDetails[src].artist)
      const matchingCard = Array.from(cards).find(card => card.getAttribute("data-src") === src);
      if (matchingCard) {
        const img = matchingCard.querySelector(".imgblock img");
        songimg.forEach(el => el.src = img.src)
      }
      audio.src = src
      audio.play()
      if (window.innerWidth <= 768) {
        document.querySelector(".mobileplaybar").style.display = "block";
      }
      isplaying = true;
      updatePauseIcons();



      audio.addEventListener("loadedmetadata", () => {
        let sec = Math.floor(audio.duration);
        let min = Math.floor(sec / 60);
        let remsec = sec % 60;
        totaltime.innerText = `${min}:${remsec < 10 ? '0' : ''}${remsec}`;
      });
    }

    function updatePlayIcons() {
      document.querySelectorAll(".playpauseicon").forEach(icon => {
        icon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 5v14l11-7z" />
      </svg>`;
      });
    }

    function updatePauseIcons() {
      document.querySelectorAll(".playpauseicon").forEach(icon => {
        icon.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 5h4v14H6zm8 0h4v14h-4z"/>
      </svg>`;
      });
    }


    audio.addEventListener("timeupdate", () => {
      let sec = Math.floor(audio.currentTime)
      let min = Math.floor(sec / 60)
      let remsec = sec % 60
      currentime.innerText = `${min}:${remsec < 10 ? '0' : ''}${remsec}`
      const progress = (audio.currentTime / audio.duration) * 1000


      seekbars.forEach(sb => {
        sb.value = progress || 0;
        sb.style.background = `linear-gradient(to right, #1DB954 0%, #1DB954 ${sb.value / 10}%, #555 ${sb.value / 10}%, #555 100%)`;
      });


      if (audio.currentTime == audio.duration) {
        playnextsong()
        isplaying = true
      }
    })

    const likeButtons = document.querySelectorAll('.like-button');

    likeButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.toggle('liked'); // Toggle filled/unfilled
      });
    });

    seekbars.forEach(sb => {
      sb.addEventListener("input", () => {
        const seektime = (sb.value / 1000) * audio.duration;
        audio.currentTime = seektime;
        sb.style.background = `linear-gradient(to right, #1DB954 0%, #1DB954 ${sb.value / 10}%, #555 ${sb.value / 10}%, #555 100%)`;
      });
    });


    hamburger.addEventListener('click', () => {
      sidebar.style.width = '250px';
      overlay.classList.add('active');
    });

    closebtn.addEventListener('click', () => {
      sidebar.style.width = '0';
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.style.width = '0';
      overlay.classList.remove('active');
    });