/**
 * Génère une grille de Sudoku 9x9 complète et valide.
 * Retourne un tableau de tableaux (Array of Arrays).
 */
function generateSudoku() {
    const size = 9;
    const grid = Array.from({ length: size }, () => Array(size).fill(0));

    // Vérifie si un nombre peut être placé à une position donnée
    function isValid(grid, row, col, num) {
        for (let i = 0; i < size; i++) {
            // Vérification de la ligne et de la colonne
            if (grid[row][i] === num || grid[i][col] === num) return false;
        }

        // Vérification du sous-carré 3x3
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[startRow + i][startCol + j] === num) return false;
            }
        }
        return true;
    }

    // Fonction récursive de remplissage par backtracking
    function fillGrid(grid) {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (grid[row][col] === 0) {
                    // Mélange des nombres de 1 à 9 pour une génération aléatoire
                    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

                    for (let num of numbers) {
                        if (isValid(grid, row, col, num)) {
                            grid[row][col] = num;

                            if (fillGrid(grid)) return true;

                            grid[row][col] = 0; // Backtrack
                        }
                    }
                    return false; // Pas de solution trouvée pour cette branche
                }
            }
        }
        return true; // Grille terminée
    }

    fillGrid(grid);
    return grid;
}

// Génère une grille de Sudoku et masque aléatoirement certaines cellules pour créer le puzzle
const mySudoku = generateSudoku();
const hiddenGrid = mySudoku.map(row => row.map(cell => (Math.random() < 0.1 ? cell : 0))); // Masque aléatoirement certaines cellules
let errorCount = 0;
console.table(hiddenGrid);
console.table(mySudoku);

// Variable pour stocker la cellule sélectionnée
let selectedCell = null;

// Affiche la grille de Sudoku dans le DOM
const sudokuBoard = document.getElementById('sudoku-board');
for (let i = 0; i < mySudoku.length; i++) {
    for (let j = 0; j < mySudoku[i].length; j++) {
        const cell = document.createElement('div');
        cell.classList.add('sudoku-cell');
        cell.textContent = hiddenGrid[i][j] === 0 ? '' : hiddenGrid[i][j];
        cell.addEventListener('click', function() {
            // Gérer la sélection de la cellule
            if (selectedCell) {
                selectedCell.classList.remove('selected');
            }
            this.classList.add('selected');
            selectedCell = this;
        });
        sudokuBoard.appendChild(cell);
    }
}

// Génère les boutons de sélection des nombres de 1 à 9
const numbersContainer = document.getElementById('numbers');
for (let num = 1; num <= 9; num++) {
    const numberButton = document.createElement('button');
    numberButton.textContent = num;
    numberButton.classList.add('number-button');
    numberButton.addEventListener('click', function() {
        this.classList.add('selected');
        for (let sibling of numbersContainer.children) {
            if (sibling !== this) {
                sibling.classList.remove('selected');
            }
        }

        if (selectedCell) {
            if (selectedCell.textContent !== '' && !selectedCell.classList.contains('error')) {
                return;
            }
            selectedCell.textContent = num;
            
            // Vérifier si c'est le bon nombre (comparer avec mySudoku)
            // Récupérer l'index de la cellule pour vérifier la solution
            const cells = Array.from(document.querySelectorAll('.sudoku-cell'));
            const cellIndex = cells.indexOf(selectedCell);
            const row = Math.floor(cellIndex / 9);
            const col = cellIndex % 9;
            
            if (mySudoku[row][col] === num) {
                // Correct!
                if (selectedCell.classList.contains('error')) {
                    selectedCell.classList.remove('error');
                }  
                selectedCell.classList.add('correct');
                if (checkWin()) {
                    alert('Félicitations ! Vous avez terminé le Sudoku en ' + seconds + ' secondes avec ' + errorCount + ' erreurs.');
                }
            } else {
                // Erreur
                if (selectedCell.classList.contains('correct')) {
                    selectedCell.classList.remove('correct');
                }
                selectedCell.classList.add('error');
                errorCount++;
                errorCountElement.textContent = errorCount;
            }
        }
    });
    numbersContainer.appendChild(numberButton);
}

//Recharge la page pour générer un nouveau niveau
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
    console.log('Nouveau niveau demandé');
    location.reload();
});

// Affiche le nombre d'erreurs
const errorCountElement = document.getElementById('error-count');
errorCountElement.textContent = errorCount;

// Affiche le nombre de victoires
const successCountElement = document.getElementById('success-count');
successCountElement.textContent = localStorage.getItem('sudokuWins') || '0';

const timerElement = document.getElementById('timer');
let seconds = 0;
let timerInterval;

function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.textContent = seconds;
    }, 1000);
}

function checkWin(){
    const cells = Array.from(document.querySelectorAll('.sudoku-cell'));
    const allCorrect = cells.every(cell => cell.classList.contains('correct') || cell.textContent === '');
    if (allCorrect) {
        clearInterval(timerInterval);
        const wins = parseInt(localStorage.getItem('sudokuWins') || '0', 10) + 1;
        localStorage.setItem('sudokuWins', String(wins));
        successCountElement.textContent = wins;
        alert('Félicitations ! Vous avez terminé le Sudoku en ' + seconds + ' secondes avec ' + errorCount + ' erreurs.');
    }
}

startTimer();