const canvas = document.querySelector("canvas");
let toolbtns = document.querySelectorAll(".tool");
let fillColor = document.querySelector("#fill-color");
let sizeSlider = document.querySelector("#size-slider");
let colorBtns = document.querySelectorAll(".colors .option");
let colorPicker = document.querySelector("#color-picker");
let clearCanvas = document.querySelector(".clear-canvas");
let saveImg = document.querySelector(".save-img");

// ctx - short word for context
var ctx = canvas.getContext("2d");

// global variables with default values
let prevMouseX, prevMouseY, snapshot;
let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 5;
let selectedColor = "#000";

// Set canvas background to white
const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor; // Set fillStyle back to the selectedColor
};

// Initialize canvas
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

// Draw rectangle
const drawRect = (e) => {
  ctx.beginPath();
  if (!fillColor.checked) {
    return ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
  ctx.fillRect(
    e.offsetX,
    e.offsetY,
    prevMouseX - e.offsetX,
    prevMouseY - e.offsetY
  );
};

// Draw circle
const drawCircle = (e) => {
  ctx.beginPath();
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  if (fillColor.checked) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

// Draw triangle
const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  if (fillColor.checked) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

// Draw line
const drawLine = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

// Start drawing
const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// Stop drawing
const stopDraw = () => {
  isDrawing = false;
};

// Handle tool selection
toolbtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

// Handle color selection
colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

// Drawing logic
const drawing = (e) => {
  if (!isDrawing) {
    return;
  }
  ctx.putImageData(snapshot, 0, 0);
  if (selectedTool === "brush" || selectedTool === "eraser") {
    if (selectedTool === "eraser") {
      ctx.strokeStyle = "#fff";
    }
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool === "rectangle") {
    drawRect(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  } else if (selectedTool === "line") {
    drawLine(e);
  }
};

// Handle slider change
sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));

// Handle color picker change
colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

// Clear canvas
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

// Save image
saveImg.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

// Event listeners for drawing
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mousemove", drawing);
