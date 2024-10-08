const indexContainer = document.getElementsByClassName("index-container")[0];
const arrayContainer = document.getElementsByClassName("array-container")[0];

const progressBar = document.getElementsByClassName("progress-bar")[0];
const speedControl = document.getElementsByClassName("speed-control")[0];
const playBtn = document.getElementsByClassName("play")[0];
const pauseBtn = document.getElementsByClassName("pause")[0];
const reverseBtn = document.getElementsByClassName("reverse")[0];
const restartBtn = document.getElementsByClassName("restart")[0];
const nSlider = document.getElementsByClassName("n-slider")[0];
const nValue = document.getElementsByClassName("array-size-value")[0];
const randomizeBtn = document.getElementsByClassName("randomize")[0];

let myArray = [];
let maxArrayValue = Math.max(...myArray);
const maxBarHeight = 250;

// Helper Functions
function generateRandomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
}

function renderBars() {
  arrayContainer.innerHTML = "";
  indexContainer.innerHTML = "";
  myArray.forEach((value, i) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");

    maxArrayValue = Math.max(...myArray);
    const barHeight = (value / maxArrayValue) * maxBarHeight;
    bar.style.height = `${barHeight}px`;

    const barValue = document.createElement("div");
    barValue.classList.add("value");
    barValue.textContent = value;

    const barIndex = document.createElement("div");
    barIndex.classList.add("index");
    barIndex.textContent = i;

    bar.appendChild(barValue);
    arrayContainer.appendChild(bar);
    indexContainer.appendChild(barIndex);
  });
}

// Renders the Array
myArray = generateRandomArray(nSlider.value);
renderBars();

// Create Timeline
let tl = gsap.timeline({
  paused: true,
  defaults: { duration: 0.5 },
  onUpdate: () => (progressBar.style.width = tl.progress() * 100 + "%"),
});

// Bubble Sortarr
function bubbleSort(arr) {
  // Get the bars
  const bars = document.querySelectorAll(".bar");
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Select two bars
      tl.to(bars[j], { backgroundColor: "#d1507b", duration: 0.25 }, ">");
      tl.to(bars[j + 1], { backgroundColor: "#d1507b", duration: 0.25 }, "<");
      tl.add("beforeSwap");

      if (arr[j] > arr[j + 1]) {
        // Swap two bars
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        tl.to(bars[j], { x: 34, ease: "power4.inOut" }), ">";
        tl.to(bars[j + 1], { x: -34, ease: "power4.inOut" }, "<");

        tl.set(bars[j], { x: 0 });
        tl.set(bars[j + 1], { x: 0 });

        tl.set(bars[j], {
          height: `${(arr[j] / maxArrayValue) * maxBarHeight}px`,
        });
        tl.set(bars[j + 1], {
          height: `${(arr[j + 1] / maxArrayValue) * maxBarHeight}px`,
        });

        tl.set(bars[j].querySelector(".value"), {
          textContent: `${arr[j]}`,
        });
        tl.set(bars[j + 1].querySelector(".value"), {
          textContent: `${arr[j + 1]}`,
        });
      }

      // Revert color back after comparison
      tl.to(
        bars[j],
        { backgroundColor: "#ddd", duration: 0.25 },
        "beforeSwap+=0.5"
      );
    }

    // Mark the sorted element
    tl.to(
      bars[arr.length - 1 - i],
      { backgroundColor: "#50b1d1", duration: 0.25 },
      ">"
    );
  }
  tl.to(bars[0], { backgroundColor: "#50b1d1", duration: 0.25 }, ">");
  console.log(tl);
}

bubbleSort(myArray);

randomizeBtn.addEventListener("click", () => {
  tl.restart();
  tl.clear();
  tl.pause();
  progressBar.style.width = "0%";

  myArray = generateRandomArray(nSlider.value);
  renderBars();
  bubbleSort(myArray);
});

// Event Listeners
playBtn.addEventListener("click", () => {
  tl.play();
});

pauseBtn.addEventListener("click", () => {
  tl.pause();
});

reverseBtn.addEventListener("click", () => {
  tl.reverse();
});

restartBtn.addEventListener("click", () => {
  tl.restart();
  tl.pause();
  progressBar.style.width = "0%";
});

speedControl.addEventListener("change", (e) => {
  const speedFactor = parseFloat(e.target.value);
  tl.timeScale(speedFactor);
});

nSlider.addEventListener("input", () => {
  nValue.textContent = nSlider.value;
});
