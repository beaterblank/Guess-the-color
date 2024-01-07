function displayScore(dataArray) {
    // Initialize variables
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalDunno = 0;
    let totalTime = 0;

    // Loop through the data array
    dataArray.forEach(item => {
        // Check if correct is true, false, or null
        if (item.correct === "correct") {
            totalCorrect++;
            totalTime += item.seconds || 0;
        } else if (item.correct === "wrong") {
            totalWrong++;
            totalTime += item.seconds || 0;
        } else if(item.correct == "dunno") {
            totalDunno++; 
        }
        
        // Add the time taken to the total time
        totalTime += item.seconds || 0;
    });

    // Calculate average time
    const averageTime = dataArray.length > 0 ? totalTime / dataArray.length : 0;

    // Display the results in the specified div
    const scoreDiv = document.getElementById('score');
    scoreDiv.innerHTML = `
        <p><b>Correct:</b> ${totalCorrect} <=> <b>Wrong: ${totalWrong}</b> <=> <b>Dunno:</b> ${totalDunno}<br><b>Average Time Taken:</b> ${averageTime.toFixed(2)} seconds </p>
        <p></p>
    `;
}

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const remainingSeconds = timeInSeconds % 60;
    return pad(minutes) + ":" + pad(remainingSeconds);
}

function pad(value) {
    return value < 10 ? "0" + value : value;
}

function addToLocalStorage(data) {
    const savedData = JSON.parse(localStorage.getItem('gameDataV2')) || [];
    savedData.push(data);
    localStorage.setItem('gameDataV2', JSON.stringify(savedData));
}


// Function to download data as CSV
function downloadJSON() {
    const parsedData = JSON.parse(localStorage.getItem('gameDataV2')) || [];

    if (parsedData.length === 0) {
    alert('No data to download.');
    return;
    }

    let jsonContent = JSON.stringify(parsedData);

    let jsonBlob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });

    let downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(jsonBlob);
    downloadLink.setAttribute("download", "file.json");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Function to generate a random color different from another color
function getRandomColor() {
    const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return "#" + r + g + b;
}

// convert RGB string to Hex String
function rgb2hex(rgb) {
    if (rgb.search("rgb") == -1) {
    return rgb;
    } else {
    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
}

function hexToRgb(hex) {
    // Remove the hash if it exists
    hex = hex.replace(/^#/, '');
  
    // Parse the hex values to separate R, G, and B
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
  
    return { r, g, b };
  }
  
  function calculateColorDistance(color1, color2) {
    const distance = {
      r: Math.abs(color1.r - color2.r),
      g: Math.abs(color1.g - color2.g),
      b: Math.abs(color1.b - color2.b),
    };
  
    return distance;
  }
  
  function calculateAverageDistance(gameData) {
    if (!Array.isArray(gameData) || gameData.length === 0) {
      return null;
    }
  
    let sumDistances_correct = { r: 0, g: 0, b: 0 };
    let sumDistances_other = { r: 0, g: 0, b: 0 };

    let min_distance_correct = {r:0,g:0,b:0};
    let max_distance_other = {r:0,g:0,b:0};

    let correct_count = 0
    let other_count = 0
    gameData.forEach((data) => {
      
      //console.log(data,data.commonColor,data.targetColor)
      // Convert hex codes to RGB
      //console.log(data)
      const commonColorRgb = hexToRgb(data.commonColor);
      const targetColorRgb = hexToRgb(data.targetColor?data.targetColor:data.oddColor);
  
      // Calculate distances for color channels separately
      const colorDistances = calculateColorDistance(commonColorRgb, targetColorRgb);

      if(data.correct == "correct"){
        sumDistances_correct.r += colorDistances.r;
        sumDistances_correct.g += colorDistances.g;
        sumDistances_correct.b += colorDistances.b;

        min_distance_correct.r = Math.min(min_distance_correct.r,colorDistances.r)
        min_distance_correct.g = Math.min(min_distance_correct.r,colorDistances.g)
        min_distance_correct.b = Math.min(min_distance_correct.r,colorDistances.b)
        
        correct_count += 1;
      }
      else{
        sumDistances_other.r += colorDistances.r;
        sumDistances_other.g += colorDistances.g;
        sumDistances_other.b += colorDistances.b;

        max_distance_other.r = Math.max(max_distance_other.r,colorDistances.r)
        max_distance_other.g = Math.max(max_distance_other.r,colorDistances.g)
        max_distance_other.b = Math.max(max_distance_other.r,colorDistances.b)

        other_count +=1;
      }

    });

    const avg_crt_dist = {
        r:(sumDistances_correct.r/correct_count),
        g:(sumDistances_correct.g/correct_count),
        b:(sumDistances_correct.b/correct_count),
    }

    const avg_other_dist = {
        r:(sumDistances_other.r/other_count),
        g:(sumDistances_other.g/other_count),
        b:(sumDistances_other.b/other_count),
    }
  
    return {
        avg_crt_dist,
        avg_other_dist,
        min_distance_correct,
        max_distance_other,
    }

  }
  
  