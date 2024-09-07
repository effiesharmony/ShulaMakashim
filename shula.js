const MINE = '💥'

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gFreeCells = []
var gBoard
console.table(gBoard)
console.log(gFreeCells)




function onInit() {
    buildBoard()
    renderBoard()
}

function buildBoard() {
    gBoard = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard.push([])
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            gFreeCells.push(gBoard[i][j])
        }
    }
    createMines(gLevel.MINES)
    // board[1][0].isMine = true
    // board[2][2].isMine = true
}

function renderBoard() {
    strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gBoard[i].length; j++) {
            var className = `currCell-${[i]}-${[j]}`
            var currCellContent = ''

            strHTML += `<td class="${className}" onclick="onCellClicked(${i},${j})">
            ${currCellContent}
            </td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
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

function onCellClicked(i, j) {
    if (gBoard[i][j].isMine) return
    gBoard[i][j].isShown = true
    renderCell(i,j)
}

function createMines() {
    for (var i = 0; i < gLevel.MINES; i++) {
        var newMine = gFreeCells.splice(getRandomIntInclusive(0, gFreeCells.length - 1), 1)[0]
        newMine.isMine = true
    }
}

function renderCell(i, j) {
    var currCellContent = ''
    var currCell = gBoard[i][j]
    setMinesNegsCount(i, j)
    var style = ''
    if (currCell.isShown) {
        if (currCell.isMine === true) {
            currCellContent = MINE
        } else if (currCell.minesAroundCount >= 0) {
            currCellContent = currCell.minesAroundCount
        }
    }
    const elCell = document.querySelector(`.currCell-${i}-${j}`)
    elCell.innerHTML = currCellContent
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// function checkGameOver(){
//     if(gBoard[i][j].isMine){
//     }
// }