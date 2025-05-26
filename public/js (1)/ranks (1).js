const ranking = [
  {
    name: "Açaí du Cheff",
    images: ["assets/Acai1.jpg"],
    description: `Açaí e mais umas parada.-----------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`
  },
  {
    name: "Cantina do Marcelo",
    images: ["assets/Marcelo1.jpg"],
    description: `Cantina do Marcelo, acho que o marcelo   \n
                  não está a venda.------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`
  },
  {
    name: "Bunitos",
    images: ["assets/Bunitos1.jpg"],
    description: `Eles não são tão bonitos assim...--------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`
  },
  {
    name: "Cantina Veloso",
    images: ["assets/Veloso1.jpg"],
    description: `Veloso... Esse nome... Gosto de como ele \n
                  soa aos ouvidos.-------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`
  },
  {
    name: "Luau",
    images: ["assets/Luau1.jpg"],
    description: `Confundia muito o nome com "Luan".-------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`
  },
  {
    name: "Spazio",
    images: ["assets/Spazio1.jpg"],
    description: `Spazio, acho que é um trocadilho com     \n
                  "espaço".--------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------\n
                  -----------------------------------------`
  }
];

const list = document.getElementById("rankList");
const searchInput = document.getElementById("searchInput");

function renderList(filtered = ranking) {
  list.innerHTML = "";

  filtered
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(est => {
      const container = document.createElement("div");
      container.className = "card-container";

      container.innerHTML = `
        <div class="rating-panel">
          <div class="details-label">
            <span>DETALHES</span>
            <div class="details-arrow"></div>
          </div>
          <div class="details-text">${est.description}</div>
        </div>
        <div class="card">
          <div class="image-slider" style="
            background-image: url('${est.images[0]}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          "></div>
          <span class="label">${est.name}</span>
          <div class="static-stars">
            ${[1, 2, 3, 4, 5].map(() => `<div class="rank-star"></div>`).join("")}
          </div>
          <div class="review-count">0 avaliações</div>
        </div>
      `;

      const ratingPanel = container.querySelector(".rating-panel");

      container.addEventListener("click", function () {
        document.querySelectorAll(".rating-panel.open").forEach(panel => {
          if (!container.contains(panel)) {
            panel.classList.remove("open");
          }
        });
        ratingPanel.classList.toggle("open");
      });

      list.appendChild(container);
    });
}

searchInput.addEventListener("input", () => {
  const search = searchInput.value.trim().toLowerCase();
  const filtered = ranking.filter(est => est.name.toLowerCase().includes(search));
  renderList(filtered);
});

renderList();
