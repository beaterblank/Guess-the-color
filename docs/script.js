document.addEventListener('DOMContentLoaded', function () {
    //global variables
    const TIMEOUT = 300
    let timerInterval;
    let seconds = 0;
    const SCALE = 2
    const MIN = 3 //according to CIE76 a ΔEab* of approximately 2.3 corresponds to a Just noticable difference
    const MAX = 128
    const N = 5

    function startTimer() {
        resetTimer()
        if (!timerInterval) {
            timerInterval = setInterval(updateTimer, 1000);
        }
    }

    function updateTimer() {
        if(document.visibilityState=="visible"){
        seconds++;
        const formattedTime = formatTime(seconds);
        document.getElementById("timer").innerText = formattedTime;
        }
        if(seconds>TIMEOUT){
        //  setupGame()
            //idk("timed_out")
        window.location.reload()
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        seconds = 0;
        document.getElementById("timer").innerText = "00:00";
    }

    function getRandomGaussianDelta() {
        let delta;
        let cont;
        do {
        cont = false
        // Generate Gaussian random value by Box-Muller Transform
        let u1 = Math.random()
        let u2 = Math.random()
        let z0 = Math.sqrt(-6 * Math.log(u1)) * Math.cos(6 * Math.PI * u2);

        // Scale and round the value
        delta = Math.round(z0 * SCALE); // Adjust the scaling factor as needed

        if (delta>-MIN && delta<MIN){
            cont=true
        }
        // Enforce minimum absolute value and handle 0
        // if (delta === 0) {
        //   // Randomly choose min or -min
        //   delta = Math.random() < 0.5 ? -MIN : MIN;
        // } else {
        //   // Ensure at least min or -min
        //   delta = Math.max(Math.abs(delta), MIN) * Math.sign(delta);
        // }
        } while (delta < -MAX || delta > MAX || cont);

        return delta;
    }

    function getColorDelta(color) {
        const hex = color.substring(1); // Remove the leading "#"
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const deltaR = getRandomGaussianDelta();
        const deltaG = getRandomGaussianDelta();
        const deltaB = getRandomGaussianDelta();

        // Ensure color values stay within valid range (0-255)
        const newR = Math.max(0, Math.min(255, r + deltaR));
        const newG = Math.max(0, Math.min(255, g + deltaG));
        const newB = Math.max(0, Math.min(255, b + deltaB));

        return "#" + newR.toString(16).padStart(2, '0') +
        newG.toString(16).padStart(2, '0') +
        newB.toString(16).padStart(2, '0');
    }

    let commonColor = getRandomColor();
    let oddColor = getColorDelta(commonColor)

    // Function to set up the game
    function setupGame() {
        // get the current game data and display score for it
        const parsedData = JSON.parse(localStorage.getItem('gameDataV2')) || [];
        displayScore(parsedData)
        const averageDistances = calculateAverageDistance(parsedData);
        console.log(averageDistances);
        startTimer()
        const container = document.getElementById('container');
        container.innerHTML = '';

        // Generate a random color for all squares
        commonColor = getRandomColor();
        oddColor = getColorDelta(commonColor)



        container.style.gridTemplateColumns = `repeat(${N}, 50px)`;
        container.style.gridTemplateRows = `repeat(${N}, 50px)`;

        // Choose a random position for the odd color square
        const oddPosition = Math.floor(Math.random() * N * N);

        // Create a 3x3 grid
        for (let i = 0; i < N * N; i++) {
        const square = document.createElement('div');
        square.className = 'color-square nes-pointer';

        // Set the odd color for the selected position
        if (i === oddPosition) {
            square.style.backgroundColor = oddColor;
        } else {
            square.style.backgroundColor = commonColor;
        }

        // Attach the click event listener outside the conditional blocks
        square.addEventListener('click', function () {
            checkColor(rgb2hex(this.style.backgroundColor), oddColor, commonColor);
        });

        container.appendChild(square);
        }
    }

    // Function to check if the clicked color is correct
    function checkColor(clickedColor, targetColor, commonColor) {
        const correct = clickedColor === targetColor ? "correct":"wrong";

        if (correct=="correct") {
        console.log("Correct", commonColor, targetColor);
        } else {
        console.log("Wrong", commonColor, targetColor);
        }
        // Save the game data to localStorage
        addToLocalStorage({ correct, commonColor, targetColor, N, MAX, MIN, SCALE,seconds });

        // Set up a new game after each click
        setupGame();
    }

    function idk(){
        const correct = "dunno"
        let targetColor = oddColor
        addToLocalStorage({ correct, commonColor, targetColor, N, MAX, MIN, SCALE,seconds });
        setupGame()
    }

    // Initialize the game
    setupGame();

    // Function to clear data from localStorage
    function clearLocalStorage() {
        localStorage.removeItem('gameDataV2');
        alert('Data cleared.');
        setupGame()
    }


    document.getElementById('downloadJSON').addEventListener('click', downloadJSON);
    document.getElementById('clearData').addEventListener('click', clearLocalStorage);
    document.getElementById('dunno').addEventListener('click',idk);
});