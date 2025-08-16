// server/public/js/votes.js
import { getAnonId } from './utils/anon.js';

const establishments = [
  { id: 1, name: "Estabelecimento 1",   images: ["assets/Acai-carrossel.png","assets/Acai-carrossel.png","assets/Acai-carrossel.png"] },
  { id: 2, name: "Estabelecimento 2", images: ["assets/Acai-carrossel.png","assets/Acai-carrossel.png"] },
  { id: 3, name: "Estabelecimento 3",          images: ["assets/Acai-carrossel.png","assets/Acai-carrossel.png"] },
  { id: 4, name: "Estabelecimento 4",   images: ["assets/Acai-carrossel.png","assets/Acai-carrossel.png"] },
  { id: 5, name: "Estabelecimento 5",             images: ["assets/Acai-carrossel.png","assets/Acai-carrossel.png"] },
  { id: 6, name: "Estabelecimento 6",           images: ["assets/Acai-carrossel.png","assets/Acai-carrossel.png","assets/Acai-carrossel.png"] }
];

const list = document.getElementById("establishmentList");
const searchInput = document.getElementById("searchInput");

function renderList(filtered = establishments) {
  list.innerHTML = "";

  filtered
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(est => {
      const container = document.createElement("div");
      container.className = "card-container";
      container.dataset.placeId = est.id;

      container.innerHTML = `
        <div class="rating-panel">
          <div class="stars">
            ${[1,2,3,4,5].map(i => `<div class="star" data-star="${i}"></div>`).join("")}
          </div>
        </div>
        <div class="card">
          <button class="prev"></button>
          <div class="image-slider"></div>
          <button class="next"></button>
          <span class="label">${est.name}</span>
        </div>
      `;

      // seleção de elementos
      const ratingPanel = container.querySelector(".rating-panel");
      const stars       = container.querySelectorAll(".star");
      const slider      = container.querySelector(".image-slider");
      const prevBtn     = container.querySelector(".prev");
      const nextBtn     = container.querySelector(".next");

      // Marca voto existente e armazena reviewId
      (async () => {
        try {
          const resVotes = await fetch(`/api/reviews?placeId=${est.id}`);
          if (!resVotes.ok) return;
          const votesList = await resVotes.json();
          const mine = votesList.find(v => v.anonId === getAnonId());
          if (mine) {
            // marca visualmente as estrelas conforme nota anterior
            stars.forEach((s,i) => s.classList.toggle('active', i < mine.rating));
            // guarda o id pra saber se deve PUT ou POST
            container.dataset.reviewId = mine.id;
          }
        } catch (err) {
          console.error('Falha ao buscar voto existente:', err);
        }
      })();

      // slider de imagens (igual ao seu)
      let currentImageIndex = 0;
      function updateImage() {
        slider.style.background = `url('${est.images[currentImageIndex]}') no-repeat center/cover`;
        prevBtn.style.display = currentImageIndex > 0                 ? "block" : "none";
        nextBtn.style.display = currentImageIndex < est.images.length-1 ? "block" : "none";
      }
      updateImage();
      prevBtn.onclick = e => { e.stopPropagation(); currentImageIndex--; updateImage(); };
      nextBtn.onclick = e => { e.stopPropagation(); currentImageIndex++; updateImage(); };

      // abrir/fechar painel de rating ao clicar no card
      container.addEventListener("click", () => {
        document.querySelectorAll(".rating-panel.open")
          .forEach(p => p !== ratingPanel && p.classList.remove("open"));
        ratingPanel.classList.toggle("open");
      });

      // evento de clique em cada estrela
      stars.forEach((star, idx) => {
        star.addEventListener("click", async e => {
          e.stopPropagation();
          // marca visualmente as estrelas
          stars.forEach((s,i) => s.classList.toggle("active", i <= idx));

          // define URL e método (POST ou PUT)
          const reviewId = container.dataset.reviewId;
          const url      = reviewId ? `/api/reviews/${reviewId}` : "/api/reviews";
          const method   = reviewId ? "PUT" : "POST";

          // payload para API
          const payload = {
            placeId: est.id,
            rating:  idx + 1,
            comment: "",
            anonId:  getAnonId()
          };

          try {
            const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });
            if (!res.ok) {
              const err = await res.json();
              console.error("Erro ao enviar review:", err.error||res.statusText);
            } else {
              const data = await res.json();
              console.log("Review salva/atualizada:", data);
              // armazena o ID caso seja um POST
              container.dataset.reviewId = data.id;
            }
          } catch(err) {
            console.error("Fetch error:", err);
          }
        });
      });

      list.appendChild(container);
    });
}

searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();
  renderList(establishments.filter(e => e.name.toLowerCase().includes(term)));
});

// Renderiza a primeira vez
renderList();
