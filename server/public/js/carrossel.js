const carossel = document.getElementById('carossel');

// Agora cada item tem um label e uma imagem
const items = [
  { label: 'Refeitório', image: 'assets/Refeitorio-carrossel.png', link: 'refeitorio.html' },
  { label: 'Açaí du Cheff', image: 'assets/Acai-carrossel.jpeg', link: 'acai.html'},
  { label: 'Bunitos', image: 'assets/Bunitos-carrossel.png', link: 'bunitos.html'},
  { label: 'Cantina do Marcelo', image: 'assets/Marcelo-carrossel.png', link: 'marcelo.html'},
  { label: 'Cantina Veloso', image: 'assets/Veloso-carrossel.png', link: 'veloso.html'},
  { label: 'Luau', image: 'assets/Luau-carrossel.png', link: 'luau.html'},
  { label: 'Spazio', image: 'assets/Spazio-carrossel.png', link: 'spazio.html'}
];

let currentIndex = 0;

function renderCarossel() {
  carossel.innerHTML = '';

  const leftIndex = (currentIndex - 1 + items.length) % items.length;
  const centerIndex = currentIndex;
  const rightIndex = (currentIndex + 1) % items.length;

const createBox = (item, position) => {
  const div = document.createElement('div');
  div.classList.add('option-box');
  if (position !== 'center') div.classList.add('side');

  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.label;
  img.classList.add('option-image');

  const label = document.createElement('span');
  label.textContent = item.label;
  label.classList.add('box-label');

  // Torna clicável
  div.addEventListener('click', () => {
    window.location.href = item.link;
  });

  div.appendChild(img);
  div.appendChild(label);
  return div;
};

  carossel.appendChild(createBox(items[leftIndex], 'left'));
  carossel.appendChild(createBox(items[centerIndex], 'center'));
  carossel.appendChild(createBox(items[rightIndex], 'right'));
}

document.querySelector('.left').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  renderCarossel();
});

document.querySelector('.right').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  renderCarossel();
});

window.addEventListener('load', renderCarossel);
