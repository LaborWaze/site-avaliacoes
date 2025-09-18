// public/js/ranks.js

// Não precisamos mais do getAnonId() nem de buscar o voto individual.
// import { getAnonId } from './utils/anon.js';

console.log('🟢 ranks.js rodando (sem voto pessoal)');

const places = [
  { id: 1, name: "Estabelecimento 1",      image: "assets/estab 1.jpeg",
    description: `-----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`},

  { id: 2, name: "Estabelecimento 2",  image: "assets/estab 2.jpeg",
    description: `-----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`},

  { id: 3, name: "Estabelecimento 3",             image: "assets/estab 3.jpeg",
    description: `-----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`},

  { id: 4, name: "Estabelecimento 4",      image: "assets/estab 4.jpeg",
    description: `-----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`},

  { id: 5, name: "Estabelecimento 5",               image: "assets/estab 5.jpeg",
    description: `-----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`},

  { id: 6, name: "Estabelecimento 6",             image: "assets/estab 6.jpeg",
    description: `-----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`}
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
   * Busca média (avgRating) e total de avaliações (count) para um dado placeId.
   * Endpoint: GET /api/reviews/average/:placeId
   * Deve retornar JSON { avgRating: "número", count: número }
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
   * Gera o HTML de 5 estrelas (estática) preenchendo proporcionalmente à avg.
   * Usa clip-path para mostrar apenas a fração correta de cada estrela.
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
   * Monta o HTML completo de um card de estabelecimento,
   * exibindo apenas a média (estats.avg) e o total de avaliações (estats.count).
   */
  function makeCard(est) {
    const { avg, count } = est.stats;
    const starsHTML = makeStars(avg);

    return `
      <div class="card-container" data-place-id="${est.id}">
        <div class="card">
          <div class="image-slider" style="background-image:url('${est.image}')"></div>
          <span class="label">${est.name}</span>

          <!-- Caixinha branca com estrelas da média geral -->
          <div class="static-stars">
            ${starsHTML}
          </div>

          <div class="review-count">
            ${count} ${count === 1 ? "Avaliação" : "Avaliações"}
          </div>
        </div>

        <!-- Painel de detalhes / descrição -->
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
   * Carrega, filtra, ordena e renderiza todos os estabelecimentos,
   * mas **sem** exibir o voto pessoal do usuário (mine).
   */
  async function updateRanking(filterText = "") {
    // 1) Filtra localmente pelo nome
    const filtered = places.filter(p =>
      p.name.toLowerCase().includes(filterText.toLowerCase())
    );

    // 2) Para cada estabelecimento filtrado, busca suas estatísticas (média e total)
    const enriched = await Promise.all(
      filtered.map(async p => {
        let stats;
        try {
          stats = await fetchStats(p.id);
        } catch (err) {
          console.error(`Erro ao buscar stats para placeId=${p.id}`, err);
          stats = { avg: 0, count: 0 };
        }
        // Não buscamos 'mine', pois não queremos exibir o voto individual
        return { ...p, stats };
      })
    );

    // 3) Ordena pelo avg (decrescente)
    enriched.sort((a, b) => b.stats.avg - a.stats.avg);

    // 4) Renderiza todos os cards de uma só vez
    container.innerHTML = enriched.map(makeCard).join("");

    // 5) Habilita clique para abrir/fechar painel de detalhes (rating-panel)
    container.querySelectorAll('.card-container').forEach(w => {
      const panel = w.querySelector('.rating-panel');
      w.addEventListener('click', () => {
        container.querySelectorAll('.rating-panel.open')
          .forEach(p => p !== panel && p.classList.remove('open'));
        panel.classList.toggle('open');
      });
    });
  }

  // Debounce no input de busca para reduzir chamadas a updateRanking
  searchInput.addEventListener("input", debounce(e => updateRanking(e.target.value), 200));

  // Renderiza pela primeira vez, sem filtro
  updateRanking();
}
