let multiplicacao = "\u00D7";
let divisao = "\u00F7";
let soma = "\u002B";
let subtracao = "\u2212";
let backspace = "\u232B"
let raizQuadrada = "\u221A";
let porcentagem = "\u0025";

let display = "0";
let teclado = document.querySelector(".keys");
let tela = document.getElementById("display");
let resultadoMostrado = false;

teclado.addEventListener("click", (e) => {
  const target = e.target;
  if (!target.matches("button")) return;

  const digit = target.dataset.digit;
  const op = target.dataset.op;
  const action = target.dataset.action;

  if (resultadoMostrado && digit) {
    display = "";
    tela.textContent = "";
    resultadoMostrado = false;
  }

  // Ações
  if (action === "clear") {
    display = "0";
    tela.textContent = display;
    resultadoMostrado = false;
    return;
  }

  if (action === "backspace") {
    if (resultadoMostrado) {
      display = "0";
      tela.textContent = display;
      resultadoMostrado = false;
      return;
    }
    display = display.slice(0, -1) || "0";
    tela.textContent = display;
    return;
  }

  if (action === "equals") {
    const expr = display.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
    try {
      let result = Function('"use strict";return (' + expr + ')')();
      if (!isFinite(result)) {
        tela.textContent = "Error";
        display = "0";
      } else {
        result = Number(Math.round(result * 1e12) / 1e12);
        display = String(result);
        tela.textContent = display;
      }
    } catch (err) {
      tela.textContent = "Error";
      display = "0";
    }
    resultadoMostrado = true;
    return;
  }

  if (typeof digit !== "undefined") {
    if (display === "0" && digit === "0") return;

    if (digit === ".") {
      const lastNumber = display.match(/(\d+(\.\d*)?)$/);
      if (lastNumber && lastNumber[0].includes(".")) return;

      if (display === "" || /[\+\−×÷]$/.test(display)) {
        display += "0.";
      } else {
        display += ".";
      }

      tela.textContent = display;
      return;
    }

    if (display === "0" && digit !== ".") {
      display = digit;
    } else {
      display += digit;
    }

    tela.textContent = display;
    return;
  }

  if (typeof op !== "undefined") {
    const opMap = {
      add: "+",
      subtract: "−",
      multiply: "×",
      divide: "÷",
    };
    const sym = opMap[op] || "";

    if (display === "" || display === "0") {
      if (op === "subtract") {
        display = "−";
        tela.textContent = display;
      }
      return;
    }

    if (/[\+\−×÷]$/.test(display)) {
      if (op === "subtract") {
        if (!display.endsWith("−")) {
          display += "−";
        }
      } else {
        display = display.replace(/[\+\−×÷]+$/, "") + sym;
      }
    } else {
      display += sym;
    }

    tela.textContent = display;
    resultadoMostrado = false; 
    return;
  }
});