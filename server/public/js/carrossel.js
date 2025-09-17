const carossel = document.getElementById('carossel');

// Agora cada item tem um label e uma imagem
const items = [
  { label: 'estabelecimento1', image: 'assets/estab 1.jpg', link: 'refeitorio.html' },
  { label: 'estabelecimento2', image: 'assets/estab 2.jpg', link: 'acai.html'},
  { label: 'estabelecimento3', image: 'assets/estab 3.jpg', link: 'bunitos.html'},
  { label: 'estabelecimento4', image: 'assets/estab 4.jpg', link: 'marcelo.html'},
  { label: 'estabelecimento5', image: 'assets/estab 5.jpg', link: 'veloso.html'},
  { label: 'estabelecimento6', image: 'assets/estab 6.jpg', link: 'luau.html'},
  { label: 'estabelecimento7', image: 'assets/estab 7.jpg', link: 'spazio.html'}
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
