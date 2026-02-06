document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid')
    const movesEl = document.getElementById('moves')
    const matchesEl = document.getElementById('matches')
    const restartBtn = document.getElementById('restart')
    const winModal = document.getElementById('winModal')
    const winText = document.getElementById('winText')
    const playAgain = document.getElementById('playAgain')

    const symbols = ['🍎', '🐶', '🚗', '🎵', '🌙', '⭐', '🍕', '⚽'] // 8 pairs -> 16 cards
    let deck = []
    let first = null
    let second = null
    let busy = false
    let moves = 0
    let matches = 0

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[a[i], a[j]] = [a[j], a[i]]
        }
        return a
    }

    function buildDeck() {
        deck = shuffle(symbols.concat(symbols).slice())
        grid.innerHTML = ''
        deck.forEach((s, idx) => {
            const card = document.createElement('button')
            card.className = 'card'
            card.setAttribute('aria-label', 'card')
            card.dataset.symbol = s

            const inner = document.createElement('div')
            inner.className = 'card-inner'

            const front = document.createElement('div')
            front.className = 'card-face card-front'
            front.textContent = ''

            const back = document.createElement('div')
            back.className = 'card-face card-back'
            back.textContent = s

            inner.appendChild(front)
            inner.appendChild(back)
            card.appendChild(inner)
            card.addEventListener('click', onCardClick)
            grid.appendChild(card)
        })
    }

    function onCardClick(e) {
        if (busy) return
        const c = e.currentTarget
        if (c.classList.contains('matched') || c.classList.contains('face-up')) return

        c.classList.add('face-up')
        if (!first) {
            first = c
            return
        }
        second = c
        busy = true
        moves++
        updateCounters()

        if (first.dataset.symbol === second.dataset.symbol) {
            first.classList.add('matched')
            second.classList.add('matched')
            matches++
            resetTurn()
            if (matches === symbols.length) showWin()
        } else {
            setTimeout(() => {
                first.classList.remove('face-up')
                second.classList.remove('face-up')
                resetTurn()
            }, 700)
        }
    }

    function resetTurn() {
        first = null
        second = null
        busy = false
        updateCounters()
    }

    function updateCounters() {
        movesEl.textContent = moves
        matchesEl.textContent = matches
    }

    function restart() {
        moves = 0
        matches = 0
        first = second = null
        busy = false
        updateCounters()
        winModal.classList.add('hidden')
        buildDeck()
    }

    function showWin() {
        winText.textContent = `You matched all pairs in ${moves} moves.`
        winModal.classList.remove('hidden')
    }

    restartBtn.addEventListener('click', restart)
    playAgain.addEventListener('click', restart)

    // initial setup
    buildDeck()
})
