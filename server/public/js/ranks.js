// public/js/ranks.js
import { getAnonId } from './utils/anon.js';

console.log('🟢 ranks.js rodando');

const places = [
  { id: 1, name: "Açaí du Cheff",      image: "assets/Acai1.jpg", description: "Pequeno ponto local..." },
  { id: 2, name: "Cantina do Marcelo",  image: "assets/Marcelo1.jpg", description: "Cantina do Marcelo..." },
  { id: 3, name: "Bunitos",             image: "assets/Bunitos1.jpg",  description: "Eles não são tão bonitos..." },
  { id: 4, name: "Cantina Veloso",     image: "assets/Veloso1.jpg",   description: "Veloso. Esse nome..." },
  { id: 5, name: "Luau",               image: "assets/Luau1.jpg",     description: "Confundia com “Luan”..." },
  { id: 6, name: "Spazio",             image: "assets/Spazio1.jpg",   description: "Trocadilho com “espaço”..." }
];

const container   = document.getElementById("rankList");
const searchInput = document.getElementById("searchInput");

// Verifica existência dos elementos
if (!container || !searchInput) {
  console.error('Elemento #rankList ou #searchInput não encontrado no DOM');
} else {

  /** Debounce para entrada de busca */
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  /**
   * Busca média e total de avaliações para um placeId
   */
  async function fetchStats(placeId) {
    const res  = await fetch(`/api/reviews/average/${placeId}`);
    if (!res.ok) throw new Error(res.statusText);
    const json = await res.json();
    const avg   = parseFloat(json.avgRating) || 0;
    const count = json.count || 0;
    return { avg, count };
  }

  /**
   * Gera o HTML de 5 estrelas com preenchimento proporcional à avg
   */
  function makeStars(avg) {
    return Array.from({ length: 5 }, (_, i) => {
      const frac = Math.min(Math.max(avg - i, 0), 1);
      const rightInset = (100 - frac * 100).toFixed(1) + '%';
      return `
        <div class="star-container">
          <img src="../assets/Star.png" class="star-bg"/>
          <img src="../assets/Star-active.png"
               class="star-fg"
               style="clip-path: inset(0 ${rightInset} 0 0);"/>
        </div>
      `;
    }).join('');
  }

  /**
   * Monta o card completo, inserindo as estrelas de média e o voto do usuário
   */
  function makeCard(est) {
    const { avg, count } = est.stats;
    const starsHTML = makeStars(avg);

    let personalHTML = '';
    if (est.mine) {
      const myStars = makeStars(est.mine.rating);
      personalHTML = `
        <div class="your-vote">
          <div class="static-stars">
            ${myStars}
          </div>
        </div>
      `;
    }

    return `
      <div class="card-container" data-place-id="${est.id}">
        <div class="card">
          <div class="image-slider" style="background-image:url('${est.image}')"></div>
          <span class="label">${est.name}</span>
          <div class="static-stars">
            ${starsHTML}
          </div>
          <div class="review-count">
            ${count} ${count === 1 ? "Avaliação" : "Avaliações"}
          </div>
        </div>
        ${personalHTML}
        <div class="rating-panel">
          <div class="details-label">
            <span>DETALHES</span>
            <div class="details-arrow"></div>
          </div>
          <div class="details-text">${est.description}</div>
        </div>
      </div>
    `;
  }

  /**
   * Carrega, filtra, ordena e renderiza tudo, incluindo voto do usuário
   */
  async function updateRanking(filterText = "") {
    const filtered = places.filter(p =>
      p.name.toLowerCase().includes(filterText.toLowerCase())
    );

    const enriched = await Promise.all(
      filtered.map(async p => {
        // Tratamento de erro individual para fetchStats
        let stats;
        try {
          stats = await fetchStats(p.id);
        } catch (err) {
          console.error(`Erro ao buscar stats para placeId=${p.id}`, err);
          stats = { avg: 0, count: 0 };
        }

        let mine = null;
        try {
          const resVotes = await fetch(`/api/reviews?placeId=${p.id}`);
          if (resVotes.ok) {
            const votes = await resVotes.json();
            mine = votes.find(v => v.anonId === getAnonId()) || null;
          }
        } catch(err) {
          console.error(`Erro ao buscar voto para placeId=${p.id}`, err);
        }

        return { ...p, stats, mine };
      })
    );

    enriched.sort((a, b) => b.stats.avg - a.stats.avg);
    container.innerHTML = enriched.map(makeCard).join("");

    // ativa clique para abrir/fechar painel de detalhes
    container.querySelectorAll('.card-container').forEach(w => {
      const panel = w.querySelector('.rating-panel');
      w.addEventListener('click', () => {
        // escopo limitado ao container
        container.querySelectorAll('.rating-panel.open')
          .forEach(p => p !== panel && p.classList.remove('open'));
        panel.classList.toggle('open');
      });
    });
  }

  // Debounce no input de busca para reduzir chamadas
  searchInput.addEventListener("input", debounce(e => updateRanking(e.target.value), 200));

  // Renderiza a primeira vez
  updateRanking();
}
