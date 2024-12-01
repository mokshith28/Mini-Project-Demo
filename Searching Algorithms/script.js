const indexContainer = document.getElementsByClassName("index-container")[0];
const arrayContainer = document.getElementsByClassName("array-container")[0];
const algorithmDropdown = document.getElementById("algorithmDropdown");
const searchKey = document.getElementById("search-key");
const outputDisplay = document.getElementsByClassName("output")[0];

const progressBar = document.getElementsByClassName("progress-bar")[0];
const speedControl = document.getElementsByClassName("speed-control")[0];
const playPauseBtn = document.getElementsByClassName("play")[0];
const playPauseIcon = document.getElementById("playPauseIcon");
const reverseBtn = document.getElementsByClassName("reverse")[0];
const forwardBtn = document.getElementsByClassName("forward")[0];
const restartBtn = document.getElementsByClassName("restart")[0];
const nSlider = document.getElementsByClassName("n-slider")[0];
const nValue = document.getElementsByClassName("array-size-value")[0];
const randomizeBtn = document.getElementsByClassName("randomize")[0];
const searchBtn = document.getElementsByClassName("search-button")[0];

let myArray = [];
let originalArray = [];
let maxArrayValue = Math.max(...myArray);
const maxBarHeight = 250;

// Helper Functions
function generateRandomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
}

function renderBoxes() {
  arrayContainer.innerHTML = "";
  indexContainer.innerHTML = "";

  myArray.forEach((value, index) => {
    // Create box element
    const box = document.createElement("div");
    box.classList.add("box");
    box.textContent = value; // Set the array value

    // Create index element
    const indexElement = document.createElement("div");
    indexElement.classList.add("index");
    indexElement.textContent = index; // Set the array index

    arrayContainer.appendChild(box);
    indexContainer.appendChild(indexElement);
  });
}

function restartTimeline() {
  progressBar.style.width = "0%";
  playPauseIcon.classList.remove("fa-pause");
  playPauseIcon.classList.add("fa-play");
  tl.restart();
  tl.pause();
}

function runSelectedAlgorithm() {
  // Get the selected value
  const selectedAlgorithm = algorithmDropdown.value;
  const key = parseInt(searchKey.value, 10);
  // console.log("before run: " + myArray);
  console.log(key);

  // Run the selected sorting function
  if (selectedAlgorithm === "linearSearch") {
    linearSearch(myArray, key);
  } else if (selectedAlgorithm === "binarySearch") {
    binarySearch(myArray, key);
  }
  console.log("after run: " + myArray);
}

// Searching Algorithms
function linearSearch(arr, target) {
  const bars = document.querySelectorAll(".box");
  const indices = document.querySelectorAll(".index");
  let isFound = false;
  for (let i = 0; i < arr.length; i++) {
    // Highlight the current bar being compared
    tl.set(indices[i], {
      innerHTML: "i",
      fontSize: 20,
      fontWeight: "bold",
      color: "#d1507b",
    });
    tl.to(bars[i], { backgroundColor: "#d1507b", duration: 0.25 }, ">");

    if (arr[i] === target) {
      // If the target is found, highlight it
      tl.to(bars[i], { backgroundColor: "#50b1d1", duration: 0.5 }, ">");
      tl.set(indices[i], {
        innerHTML: "i",
        fontSize: 20,
        fontWeight: "bold",
        color: "#50b1d1",
      });
      tl.set(outputDisplay, { innerHTML: "Key is found at index " + i });
      isFound = true;
      break; // Stop the search once the target is found
    } else {
      // Revert the color of the bar if not the target
      tl.to(bars[i], { backgroundColor: "#333", duration: 0.25 }, ">");
    }
    tl.set(indices[i], {
      innerHTML: i,
      fontSize: 12,
      fontWeight: "normal",
      color: "#fff",
    });
  }
  if (!isFound) {
    tl.set(outputDisplay, { innerHTML: "Key is not found" });
  }
}

function binarySearch(arr, target) {
  myArray.sort();
  renderBoxes();
  const bars = document.querySelectorAll(".box");
  const indices = document.querySelectorAll(".index");
  let low = 0;
  let high = arr.length - 1;
  let isFound = false;

  while (low <= high) {
    tl.set(indices[low], {
      innerHTML: "low",
      fontSize: 15,
      fontWeight: "bold",
      color: "#50b1d1",
    });
    tl.set(indices[high], {
      innerHTML: "high",
      fontSize: 15,
      fontWeight: "bold",
      color: "#50b1d1",
    });
    const mid = Math.floor((low + high) / 2);

    // Highlight the current middle index
    tl.set(indices[mid], {
      innerHTML: "mid",
      fontSize: 15,
      fontWeight: "bold",
      color: "#d1507b",
    });
    tl.to(bars[mid], { backgroundColor: "#d1507b", duration: 0.5 }, ">");

    if (arr[mid] === target) {
      // Key is found at the mid index
      tl.to(bars[mid], { backgroundColor: "#50b1d1", duration: 0.5 }, ">");
      tl.set(indices[mid], {
        innerHTML: "mid",
        fontSize: 20,
        fontWeight: "bold",
        color: "#50b1d1",
      });
      tl.set(outputDisplay, { innerHTML: "Key is found at index " + mid });
      isFound = true;
      break;
    } else if (arr[mid] < target) {
      // Key is in the right half, discard the left half
      for (let i = low; i <= mid; i++) {
        tl.to(bars[i], { backgroundColor: "#333", duration: 0.25 }, ">");
        tl.set(indices[i], {
          innerHTML: i,
          fontSize: 12,
          fontWeight: "normal",
          color: "#fff",
        });
      }
      low = mid + 1;
    } else {
      // Key is in the left half, discard the right half
      for (let i = mid; i <= high; i++) {
        tl.to(bars[i], { backgroundColor: "#333", duration: 0.25 }, ">");
        tl.set(indices[i], {
          innerHTML: i,
          fontSize: 12,
          fontWeight: "normal",
          color: "#fff",
        });
      }
      high = mid - 1;
    }

    // Reset mid index style after this iteration
    tl.set(indices[mid], {
      innerHTML: mid,
      fontSize: 12,
      fontWeight: "normal",
      color: "#fff",
    });
  }

  if (!isFound) {
    tl.set(outputDisplay, { innerHTML: "Key is not found" });
  }
}

// Event Listeners
algorithmDropdown.addEventListener("change", () => {
  restartTimeline();
  tl.clear();

  // Reset the array variable
  myArray = originalArray;

  console.log("after reset: " + myArray);
  renderBoxes();
});

randomizeBtn.addEventListener("click", () => {
  restartTimeline();
  tl.clear();

  myArray = generateRandomArray(nSlider.value);
  originalArray = [...myArray];
  renderBoxes();
});

playPauseBtn.addEventListener("click", () => {
  if (tl.progress() != 1) {
    if (tl.isActive()) {
      playPauseIcon.classList.remove("fa-pause");
      playPauseIcon.classList.add("fa-play");
      tl.pause();
    } else {
      playPauseIcon.classList.remove("fa-play");
      playPauseIcon.classList.add("fa-pause");
      tl.resume();
    }
  }
});

reverseBtn.addEventListener("click", () => {
  if (tl.progress() != 0) {
    playPauseIcon.classList.remove("fa-play");
    playPauseIcon.classList.add("fa-pause");
    tl.reverse();
  }
});

forwardBtn.addEventListener("click", () => {
  if (tl.progress() != 1) {
    playPauseIcon.classList.remove("fa-play");
    playPauseIcon.classList.add("fa-pause");
    tl.play();
  }
});

restartBtn.addEventListener("click", restartTimeline);

searchBtn.addEventListener("click", () => {
  runSelectedAlgorithm();
  playPauseIcon.classList.remove("fa-play");
  playPauseIcon.classList.add("fa-pause");
  tl.play();
});

speedControl.addEventListener("change", (e) => {
  const speedFactor = parseFloat(e.target.value);
  tl.timeScale(speedFactor);
  playPauseIcon.classList.remove("fa-pause");
  playPauseIcon.classList.add("fa-play");
  tl.pause();
});

nSlider.addEventListener("input", () => {
  nValue.textContent = nSlider.value;
});

// Starting Point
myArray = generateRandomArray(nSlider.value);
originalArray = [...myArray];
renderBoxes();

// Create Timeline
let tl = gsap.timeline({
  paused: true,
  defaults: { duration: 0.5 },
  onUpdate: () => (progressBar.style.width = tl.progress() * 100 + "%"),
  onComplete: () => {
    playPauseIcon.classList.remove("fa-pause");
    playPauseIcon.classList.add("fa-play");
  },
  onReverseComplete: () => {
    playPauseIcon.classList.remove("fa-pause");
    playPauseIcon.classList.add("fa-play");
  },
});