/* ------------------------------------------------------------------ *
 * Memento Mori — lógica de la aplicación.
 *
 * Cada punto es un mes de una vida de 80 años (80 × 12 = 960 meses).
 * Las filas son los años (eje vertical) y las columnas los meses
 * (eje horizontal). Se rellenan los meses ya vividos a partir de la
 * fecha de nacimiento, que se guarda en localStorage.
 * ------------------------------------------------------------------ */
(function () {
  "use strict";

  var YEARS = 80;
  var MONTHS = 12;
  var TOTAL = YEARS * MONTHS;
  var STORAGE_KEY = "mementoMori.birth";

  var el = {
    months: document.getElementById("months"),
    years:  document.getElementById("years"),
    dots:   document.getElementById("dots"),
    intro:  document.getElementById("intro"),
    form:   document.getElementById("form"),
    birth:  document.getElementById("birth"),
    reset:  document.getElementById("reset")
  };

  var cells = [];

  /* ----- construir la cuadrícula una sola vez ----- */
  function build() {
    var f, i;

    // etiquetas de meses (1..12) sobre el eje horizontal
    f = document.createDocumentFragment();
    for (i = 1; i <= MONTHS; i++) {
      var span = document.createElement("span");
      span.textContent = i;
      f.appendChild(span);
    }
    el.months.appendChild(f);

    // etiquetas de años (cada 10) sobre el eje vertical
    f = document.createDocumentFragment();
    for (i = 1; i <= YEARS; i++) {
      var b = document.createElement("b");
      b.style.gridRow = i;
      b.textContent = (i % 10 === 0) ? i : "";
      f.appendChild(b);
    }
    el.years.appendChild(f);

    // puntos: fila = año (de arriba a abajo), columna = mes
    f = document.createDocumentFragment();
    for (i = 0; i < TOTAL; i++) {
      var cell = document.createElement("div");
      cell.className = "cell";
      cell.appendChild(document.createElement("i"));
      f.appendChild(cell);
      cells.push(cell);
    }
    el.dots.appendChild(f);
  }

  /* ----- mantener los puntos redondos y dentro de su celda ----- */
  function sizeDots() {
    var w = el.dots.clientWidth;
    var h = el.dots.clientHeight;
    if (!w || !h) return;
    var d = Math.max(3, Math.floor(Math.min(w / MONTHS, h / YEARS) * 0.66));
    document.documentElement.style.setProperty("--dot", d + "px");
  }

  /* ----- meses completos vividos desde el nacimiento ----- */
  function monthsLived(birthISO) {
    var birth = new Date(birthISO + "T00:00:00");
    var now = new Date();
    var m = (now.getFullYear() - birth.getFullYear()) * 12 +
            (now.getMonth() - birth.getMonth());
    if (now.getDate() < birth.getDate()) m--;   // mes aún no cumplido
    return Math.max(0, m);
  }

  /* ----- pintar el estado de cada punto ----- */
  function paint(birthISO) {
    var lived = Math.min(monthsLived(birthISO), TOTAL);
    for (var i = 0; i < cells.length; i++) {
      cells[i].className = "cell" + (i < lived ? " lived" : "");
    }
    if (lived > 0 && lived <= TOTAL) cells[lived - 1].classList.add("now");
  }

  /* ----- iniciar con una fecha ----- */
  function start(birthISO) {
    localStorage.setItem(STORAGE_KEY, birthISO);
    el.intro.classList.add("hidden");
    el.reset.hidden = false;
    sizeDots();
    paint(birthISO);
  }

  /* ----- eventos ----- */
  function bind() {
    // no permitir fechas futuras
    var t = new Date();
    el.birth.max = t.getFullYear() + "-" +
      String(t.getMonth() + 1).padStart(2, "0") + "-" +
      String(t.getDate()).padStart(2, "0");

    el.form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (el.birth.value) start(el.birth.value);
    });

    el.reset.addEventListener("click", function () {
      localStorage.removeItem(STORAGE_KEY);
      el.reset.hidden = true;
      el.intro.classList.remove("hidden");
    });

    window.addEventListener("resize", sizeDots);
  }

  /* ----- arranque ----- */
  function init() {
    build();
    bind();
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      el.birth.value = saved;
      start(saved);
    } else {
      sizeDots();   // deja la cuadrícula lista tras la pantalla de inicio
    }
  }

  init();
})();
