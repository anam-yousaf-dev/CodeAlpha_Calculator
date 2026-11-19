const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";

function updateDisplay() {
  const shown = expression
    .replace(/\*/g, "×")
    .replace(/\//g, "÷")
    .replace(/-/g, "−");
  display.textContent = shown === "" ? "0" : shown;
}

function calculate() {
  if (expression === "") return;

  const cleaned = expression.replace(/(^|[+\-*/])0+(\d)/g, "$1$2");

  try {
    const result = Function("return " + cleaned)();

    if (!isFinite(result)) {
      expression = "";
      display.textContent = "Error";
      return;
    }

    expression = String(Math.round(result * 1e10) / 1e10);
    updateDisplay();
  } catch (error) {
    expression = "";
    display.textContent = "Error";
  }
}

buttons.addEventListener("click", function (event) {
  const button = event.target;
  if (!button.matches("button")) return;

  const value = button.dataset.value;
  const action = button.dataset.action;

  if (value !== undefined) {
    expression += value;
    updateDisplay();
  } else if (action === "clear") {
    expression = "";
    updateDisplay();
  } else if (action === "delete") {
    expression = expression.slice(0, -1);
    updateDisplay();
  } else if (action === "equals") {
    calculate();
  }
});

document.addEventListener("keydown", function (event) {
  const key = event.key;

  if ("0123456789.+-*/".includes(key)) {
    expression += key;
    updateDisplay();
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    expression = expression.slice(0, -1);
    updateDisplay();
  } else if (key === "Escape" || key.toLowerCase() === "c") {
    expression = "";
    updateDisplay();
  }
});