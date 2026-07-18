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
    day:    document.getElementById("day"),
    month:  document.getElementById("month"),
    year:   document.getElementById("year"),
    error:  document.getElementById("error"),
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

  function pad2(n) { return String(n).padStart(2, "0"); }

  /* ----- validar día / mes / año ----- */
  function validate(dd, mm, yy) {
    if (!dd || !mm || !yy) {
      return { ok: false, msg: "Completa día, mes y año." };
    }
    var day = +dd, mon = +mm, year = +yy;
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (year < 1900 || year > now.getFullYear()) {
      return { ok: false, msg: "El año debe estar entre 1900 y " + now.getFullYear() + "." };
    }
    if (mon < 1 || mon > 12) {
      return { ok: false, msg: "El mes debe estar entre 1 y 12." };
    }
    if (day < 1 || day > 31) {
      return { ok: false, msg: "El día debe estar entre 1 y 31." };
    }
    // fecha real (rechaza 31/02, etc.)
    var dt = new Date(year, mon - 1, day);
    if (dt.getFullYear() !== year || dt.getMonth() !== mon - 1 || dt.getDate() !== day) {
      return { ok: false, msg: "Esa fecha no existe." };
    }
    if (dt > today) {
      return { ok: false, msg: "La fecha no puede ser futura." };
    }
    return { ok: true, iso: year + "-" + pad2(mon) + "-" + pad2(day) };
  }

  /* ----- eventos ----- */
  function bind() {
    var fields = [el.day, el.month, el.year];

    fields.forEach(function (input, idx) {
      // solo dígitos + auto-avance al llenar la casilla
      input.addEventListener("input", function () {
        input.value = input.value.replace(/\D/g, "");
        el.error.textContent = "";
        input.classList.remove("invalid");
        var max = +input.getAttribute("maxlength");
        if (input.value.length >= max && idx < fields.length - 1) {
          fields[idx + 1].focus();
        }
      });
      // retroceso al campo anterior si está vacío
      input.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !input.value && idx > 0) {
          fields[idx - 1].focus();
        }
      });
    });

    el.form.addEventListener("submit", function (e) {
      e.preventDefault();
      var res = validate(el.day.value, el.month.value, el.year.value);
      if (res.ok) {
        start(res.iso);
      } else {
        el.error.textContent = res.msg;
        fields.forEach(function (f) { f.classList.add("invalid"); });
      }
    });

    el.reset.addEventListener("click", function () {
      localStorage.removeItem(STORAGE_KEY);
      el.reset.hidden = true;
      el.error.textContent = "";
      el.intro.classList.remove("hidden");
      el.day.focus();
    });

    window.addEventListener("resize", sizeDots);
  }

  /* ----- arranque ----- */
  function init() {
    build();
    bind();
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) {
      var parts = saved.split("-");
      el.year.value = parts[0];
      el.month.value = parts[1];
      el.day.value = parts[2];
      start(saved);
    } else {
      sizeDots();   // deja la cuadrícula lista tras la pantalla de inicio
    }
  }

  init();
})();
