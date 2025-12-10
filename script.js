console.log('Lets write JavaScript');
let currentsong = new Audio()
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs() {

    let a = await fetch("http://127.0.0.1:3000/songs/")
    let responce = await a.text()
    let div = document.createElement("div")
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("songs")[1])
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    currentsong.src = "/songs/" + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track.replace("%5C", " "))
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    songs = await getsongs()
    playMusic(songs[0], true)
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
    <div class="info">
        <div>${song.replace("%5C", " ")}</div>
    </div>
    <img class="invert" src="play.svg" alt="">
</li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", Element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        } else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })

    previous.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0){
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length ){
            playMusic  (songs[index + 1])
        }
    })

    document.querySelector(".range").firstElementChild.addEventListener("click",(e)=>{
        currentsong.volume = parseInt(e.target.value)/100
    })

    document.querySelector(".hamburgerContainer").firstElementChild.addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").firstElementChild.addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-130%"
    })
}

main() 