var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

var cd = $('.img-song');
var header = $('.song-name-playing');
var audio = $('#audio');
var playPauseBtn = $('.controls-btn-main');
var playBtn = $('.btn-play');
var pauseBtn = $('.btn-pause');
var nextBtn = $('.btn-next');
var prevBtn = $('.btn-prev');
var progress = $('.input-range');
var reloadBtn = $('.btn-reload');
var randomBtn = $('.btn-shuffle');
var listSong = $('.list-song');


var app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isReload: false,
    songs: [
        {
            name: 'Bỏ em vào ba lô',
            author: 'Đức Lê',
            link: './assets/song/song1.mp3',
            imgSong: './assets/img/pic1.jpg'
        },
        {
            name: 'Những Ngày Mưa Cô Đơn',
            author: 'Trung Quân Idol',
            link: './assets/song/song2.mp3',
            imgSong: './assets/img/pic2.jpg'
        },
        {
            name: 'Độ Tộc 2',
            author: 'Masew, Độ Mixi, Phúc Du, Pháo',
            link: './assets/song/song3.mp3',
            imgSong: './assets/img/pic3.jpg'
        },
        {
            name: 'Cafe, Thuốc Lá Và Những Ngày Vui',
            author: 'Thế Bảo',
            link: './assets/song/song4.mp3',
            imgSong: './assets/img/pic4.jpg'
        },
        {
            name: 'Về Phía Mưa',
            author: 'Thế Bảo',
            link: './assets/song/song5.mp3',
            imgSong: './assets/img/pic5.jpg'
        }
    ],

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
               return app.songs[app.currentIndex];
            } 
        })
    },

    loadSong: function() {
        header.textContent = this.currentSong.name;
        cd.src = this.currentSong.imgSong;
        audio.src = this.currentSong.link;
    },

    handleEvents: function() {

        // Scroll screen phóng to / thu nhỏ thumbnail
        var cdWidth = cd.offsetWidth
        document.onscroll = function() {
            var scroll = window.screenY || document.documentElement.scrollTop;
            var newCdWidth = cdWidth - scroll;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Quay cd
        const cdAnimate = cd.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 20000,
            iterations: Infinity
        })
        cdAnimate.pause();

        // Play / Pause song
        playPauseBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        audio.onplay = function() {
            app.isPlaying = true;
            pauseBtn.classList.add('play')
            playBtn.classList.remove('play');
            cdAnimate.play();
        }

        audio.onpause = function() {
            app.isPlaying = false;
            playBtn.classList.add('play');
            pauseBtn.classList.remove('play')
            cdAnimate.pause();
        }

        // Time update
        audio.ontimeupdate = function() {
            if (audio.duration) {
                var currentProgress = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = currentProgress;
            }
        }

        // Tua song
        progress.onchange = function() {
            var seek = progress.value * audio.duration / 100;
            audio.currentTime = seek;
        }

        // Next song btn
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
            app.render();
            audio.play();
            app.scrollToActiveSong();
        }

        //prev song btn
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.prevSong();
            }
            app.render();
            audio.play();
            app.scrollToActiveSong();
        }

        // Khi song ended và reload song
        audio.onended = function() {
            if (app.isReload) {
                app.loadSong();
                audio.play();
            } else
            nextBtn.click();
        }

        //random song btn
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle('active');
        }

        //reload song btn
        reloadBtn.onclick = function() {
            app.isReload = !app.isReload;
            reloadBtn.classList.toggle('active');
        }

        // click song
        listSong.onclick = function(e) {
           const songNode = e.target.closest('.item-song:not(.active)');
           if (songNode || e.target.closest('.option')) {
               if (!e.target.closest('.option')) {
                   if (songNode) {
                       app.currentIndex = Number(songNode.dataset.index);
                       app.render();
                       app.loadSong();
                       audio.play();
                       app.scrollToActiveSong();
                    }
                }
           }
        }
    },

    // scrool into view
    scrollToActiveSong: function() {
        if (app.currentIndex == 0 || app.currentIndex == 1){
            setTimeout(() => {
                $('.item-song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                })
            }, 300)
        } else {
            setTimeout(() => {
                $('.item-song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }, 300)
        }
    },

    // random-song
    randomSong: function() {
        do {
            var newIndex = Math.floor(Math.random() * app.songs.length);
        } while (app.currentIndex == newIndex)
        app.currentIndex = newIndex;
        app.loadSong();
    },

    // next-song
    nextSong: function() {
        app.currentIndex++;
        if (app.currentIndex >= app.songs.length) {
            app.currentIndex = 0;
        }
        app.loadSong();
    },

    // prev-song
    prevSong: function() {
        app.currentIndex--;
        if (app.currentIndex < 0) {
            app.currentIndex = app.songs.length - 1;
        }
        app.loadSong();
    },

    render: function() {
        var html = this.songs.map((song, index) => {
            return `<div class="item-song ${(index == this.currentIndex) ? 'active' : ''}" data-index=${index}>
                        <img src="${song.imgSong}" alt="" class="img-song mini-img">
                        <div class="list-song__des">
                            <div class="list-song-name">${song.name}</div>
                            <div class="list-song-author">${song.author}</div>
                        </div>
                        <i class="option ti-more-alt"></i>
                    </div>`
        })
        listSong.innerHTML = html.join('');
    },

    start: function() {
        this.defineProperties();
        this.loadSong();
        this.handleEvents();
        

        this.render();
    }
}

app.start();


