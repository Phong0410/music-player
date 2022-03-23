const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const cd = $('.cd')
const audio = $('#audio')
const togglePlayBtn = $('.btn.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnNext = $('.btn.btn-next')
const btnPrev = $('.btn.btn-prev')
const btnRandom = $('.btn.btn-random')
const btnRepeat = $('.btn.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Bad Apple',
            singer: 'Unknown',
            path: './assets/music/bad-apple.mp3',
            img: './assets/img/Photos.png',
            id: 'id-0'
        },
        {
            name: 'Feryquitous Ordirehv',
            singer: 'Unknown',
            path: './assets/music/feryquitous-ordirehv.mp3',
            img: './assets/img/Photos.png',
            id: 'id-1'
        },
        {
            name: 'In The End',
            singer: 'Unknown',
            path: './assets/music/in-the-end.mp3',
            img: './assets/img/Photos.png',
            id: 'id-2'
        },
        {
            name: 'Numb',
            singer: 'Unknown',
            path: './assets/music/numb.mp3',
            img: './assets/img/Photos.png',
            id: 'id-3'
        },
        {
            name: 'Seven Nation Army',
            singer: 'Unknown',
            path: './assets/music/seven-nation-army.mp3',
            img: './assets/img/Photos.png',
            id: 'id-4'
        },
        {
            name: 'That Girl',
            singer: 'Unknown',
            path: './assets/music/that-girl.mp3',
            img: './assets/img/Photos.png',
            id: 'id-5'
        },
        {
            name: 'Tragedy Eternity',
            singer: 'Unknown',
            path: './assets/music/tragedy-eternity.mp3',
            img: './assets/img/Photos.png',
            id: 'id-6'
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map(song => {
            return `
                <div class="song" data-id="${song.id}">
                    <div class="thumb"
                        style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')

        if (this.isRandom) {
            btnRandom.classList.add('active')
        }
        if (this.isRepeat) {
            btnRepeat.classList.add('active')
        }
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    }
    ,
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        const cdThumbAnimation = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],
            {
                duration: 10000,
                iterations: Infinity
            }
        )
        cdThumbAnimation.pause()

        document.onscroll = function () {
            const scrollTop = window.screenY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            if (newCdWidth > 0) {
                cd.style.width = newCdWidth + 'px'
            }
            else {
                cd.style.width = 0 + 'px'
            }
            cd.style.opacity = newCdWidth / cdWidth
        }

        togglePlayBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }

        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimation.play()
        }
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimation.pause()
        }

        audio.ontimeupdate = function () {
            const currentTime = audio.currentTime * 1000 / audio.duration
            progress.value = currentTime || 0
        }

        progress.onchange = function (event) {
            const seekTime = event.target.value / progress.max * audio.duration
            audio.currentTime = seekTime
        }

        btnNext.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
        }

        btnPrev.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.previousSong()
            }
        }

        btnRandom.onclick = function (event) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            this.classList.toggle('active')
        }

        btnRepeat.onclick = function (event) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            this.classList.toggle('active')
        }

        audio.onended = function () {
            if (_this.isRepeat) {
                _this.playRepeatSong()
                audio.play()
            }
            else {
                btnNext.click()
                audio.play()
            }
        }

        playlist.onclick = function (event) {
            const songElement = event.target.closest('.song:not(.active)')
            if (songElement || event.target.closest('.option')) {
                if (songElement) {
                    // console.log(songElement.dataset.id.slice(3))
                    _this.currentIndex = Number(songElement.dataset.id.slice(3))
                    _this.loadCurrentSong()
                    audio.play()
                }
                if (event.target.closest('.option')) {
                    console.log("option's clicked")
                }
            }
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
        if (this.isPlaying) {
            audio.play()
        } else {
            audio.pause()
        }
        if ($('.song.active')) {
            $('.song.active').classList.remove('active')
        }
        $(`.song[data-id="${this.currentSong.id}"]`).classList.add('active')
        this.scrollToActiveSong()
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    previousSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    playRepeatSong: function () {
        this.loadCurrentSong()
    },
    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300)
    },
    start: function () {
        this.loadConfig()
        this.render()
        this.defineProperties()
        this.loadCurrentSong()
        this.handleEvents()

    }
}

app.start()