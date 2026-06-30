let interBoldPromise;
let interRegularPromise;

function loadFont(url) {
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`Failed to load font: ${url}`);
    return res.arrayBuffer();
  });
}

export function getOgFonts() {
  if (!interBoldPromise) {
    interBoldPromise = loadFont(
      'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf'
    );
  }
  if (!interRegularPromise) {
    interRegularPromise = loadFont(
      'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf'
    );
  }

  return Promise.all([interBoldPromise, interRegularPromise]).then(([bold, regular]) => [
    { name: 'Inter', data: bold, style: 'normal', weight: 700 },
    { name: 'Inter', data: regular, style: 'normal', weight: 400 },
  ]);
}
