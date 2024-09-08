const MINE = '💥'
const LIFE = '💗'

var gLevels = {
    beginner: {
        lives: 2,
        SIZE: 4,
        MINES: 2
    },

    medium: {
        lives: 3,
        SIZE: 8,
        MINES: 14
    },

    expert: {
        lives: 3,
        SIZE: 12,
        MINES: 32
    }
}

var gSmiley = '😀'
var gCurrentLevel = 'beginner'
var gGame = {
    lives: 0,
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gFreeCells = []
var gBoard
var gMines = []
var gIsFirstClick = true





function onInit() {
    gIsFirstClick = true
    buildBoard(gLevels.beginner)
    gGame.lives = gLevels.beginner.lives
    renderBoard()
    renderLives()
    renderSmileyBtn()
    gGame.isOn = true
}

function buildBoard(level) {
    gFreeCells = []
    gBoard = []
    for (var i = 0; i < level.SIZE; i++) {
        gBoard.push([])
        for (var j = 0; j < level.SIZE; j++) {
            gBoard[i][j] = {
                i: i,
                j: j,
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            gFreeCells.push(gBoard[i][j])
        }
    }
}

function createMines(amount) {
    gMines = []
    for (var i = 0; i < amount; i++) {
        var newMine = gFreeCells.splice(getRandomIntInclusive(0, gFreeCells.length - 1), 1)[0]
        newMine.isMine = true
        gMines.push(newMine)
    }
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function renderBoard() {
    strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[i].length; j++) {
            var className = `currCell-${[i]}-${[j]}`
            var currCellContent = ''

            strHTML += `<td class="${className}" onclick="onCellClicked(${i},${j})" oncontextmenu="flag(${i},${j})">
            ${currCellContent}
            </td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function renderCell(i, j, currCellContent) {
    if (!gGame.isOn) return
    const elCell = document.querySelector(`.currCell-${i}-${j}`)
    elCell.innerHTML = currCellContent
    if (gBoard[i][j].isShown === true) {
        elCell.style.backgroundColor = '#5f9181'
        elCell.style.border = 'none'
        elCell.style.width = '25px'
        elCell.style.height = '25px'
    }
}

function flag(i, j) {
    if (gBoard[i][j].isShown) return
    var currCellContent = ''
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    if (gBoard[i][j].isMarked) currCellContent = '🚩'
    renderCell(i, j, currCellContent)
    checkIfWin(i, j)
}

function onCellClicked(i, j) {
    var currCell = gBoard[i][j]
    if (currCell.isMarked) return
    if (gIsFirstClick) {
        gFreeCells.splice(gFreeCells.indexOf(currCell), 1)
        createMines(gLevels[gCurrentLevel].MINES)
        gIsFirstClick = false
    }
    currCell.isShown = true
    var currCellContent = ''
    setMinesNegsCount(i, j)

    if (currCell.isMine) {
        currCellContent = MINE
        gGame.lives--
    } else if (currCell.minesAroundCount > 0) {
        currCellContent = currCell.minesAroundCount
    } else if (currCell.minesAroundCount === 0) {
        currCellContent = 0
        renderNegs(i, j)
    }
    renderCell(i, j, currCellContent)
    renderLives()
    checkIfLose(i, j)
    checkIfWin(i, j)
}

function renderNegs(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            gBoard[i][j].isShown = true
            setMinesNegsCount(i, j)
            renderCell(i, j, gBoard[i][j].minesAroundCount)
        }
    }
}

function setMinesNegsCount(cellI, cellJ) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].isMine === true) negsCount++
        }
    }
    gBoard[cellI][cellJ].minesAroundCount = negsCount
}

function checkIfLose(i, j) {
    if (gGame.lives > 0) return
    if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
        for (var i = 0; i < gMines.length; i++) {
            gMines[i].isShown = true
            renderCell(gMines[i].i, gMines[i].j, MINE)
        }
        gSmiley = '💩'
        renderSmileyBtn()
        gGame.isOn = false
    }
}

function checkFreeCellsForWin(){
    for (var i = 0; i < gFreeCells.length; i++) {
        if (!gFreeCells[i].isShown) {
            return false
        }
    }
    return true
}

function checkMinesForWin() {
    for (var i = 0; i < gMines.length; i++) {
        if (!(gMines[i].isMarked || gMines[i].isShown)) {
                return false
            } 
        }
    return true
}

function checkIfWin() {
    if (!gGame.isOn) return false
    if(checkFreeCellsForWin() && checkMinesForWin()) {
    gSmiley = '🏆'
    renderSmileyBtn()
    gGame.isOn = false
    }
}

function onRenderLevel(level) {
    gIsFirstClick = true
    gCurrentLevel = level
    gGame.lives = gLevels[level].lives
    buildBoard(gLevels[level])
    renderBoard()
    renderLives()
}

function renderLives() {
    var strHTML = ''
    for (var i = 0; i < gGame.lives; i++) {
        strHTML += LIFE
    }
    var elLives = document.querySelector('.lives')
    elLives.innerHTML = strHTML
}

function renderSmileyBtn() {
    var elSmiley = document.querySelector('.smiley')
    elSmiley.innerHTML = gSmiley
}

function onRestart() {
    gSmiley = '😀'
    renderSmileyBtn()
    onRenderLevel(gCurrentLevel)
    gGame.isOn = true
}