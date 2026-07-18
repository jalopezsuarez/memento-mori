# Memento Mori

> *Vivamos, ya que hemos de morir.*

Una visualización de tu vida en **80 años, mes a mes**. Cada punto es un mes;
los meses ya vividos se rellenan y el mes actual se resalta. Pensada para el
móvil en **vertical**: los años en el eje vertical y los meses en el horizontal,
todo en pantalla **sin scroll**.

**Demo:** https://jalopezsuarez.github.io/memento-mori/

## Cómo funciona

1. Al abrirla por primera vez te pide tu **fecha de nacimiento**.
2. La fecha se guarda en el **`localStorage`** del navegador (nada sale de tu
   dispositivo).
3. Se rellenan los puntos de los meses vividos y se marca el mes en curso.
4. El botón discreto **«fecha»** (arriba a la derecha) permite cambiarla.

## Características

- **HTML, CSS y JavaScript vanilla puro**, sin dependencias ni build.
- Diseño **vertical** para móvil sin necesidad de girar la pantalla.
- **Sin scroll** ni horizontal ni vertical: la cuadrícula se redimensiona al
  espacio disponible.
- Persistencia local con `localStorage`.
- Estética sobria de póster: tipografía serif y la cita de Marco Aurelio.

## Estructura

```
memento-mori/
├── index.html      # estructura de la página
├── styles.css      # estilos y maquetación de la cuadrícula
├── app.js          # lógica: cuadrícula, cálculo de meses y persistencia
└── .github/workflows/pages.yml   # publicación automática en GitHub Pages
```

## Uso local

No necesita build ni servidor. Basta con abrir `index.html` en el navegador:

```bash
# opción directa
xdg-open index.html      # Linux
open index.html          # macOS

# o servirlo (recomendado para probar como en producción)
python3 -m http.server 8000
# y abrir http://localhost:8000
```

## Publicación en GitHub Pages

El repositorio incluye un workflow (`.github/workflows/pages.yml`) que publica
el sitio automáticamente. Para activarlo:

1. En GitHub: **Settings → Pages → Build and deployment → Source: GitHub
   Actions**.
2. Cada `push` a la rama `main` (o ejecución manual del workflow) despliega la
   web.

El sitio queda disponible en `https://<usuario>.github.io/memento-mori/`.

## Tecnología

Sin frameworks. Solo estándares web: HTML5, CSS3 (Grid y Flexbox) y JavaScript.
