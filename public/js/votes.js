const establishments = [
  {
    name: "Açaí du Cheff",
    images: ["assets/Acai4.png", "assets/Acai5.png", "assets/Acai6.png"]
  },
  {
    name: "Cantina do Marcelo",
    images: ["assets/Marcelo3.png", "assets/Marcelo4.png"]
  },
  {
    name: "Bunitos",
    images: ["assets/Bunitos3.png", "assets/Bunitos4.png"]
  },
  {
    name: "Cantina Veloso",
    images: ["assets/Veloso3.png", "assets/Veloso4.png"]
  },
  {
    name: "Luau",
    images: ["assets/Luau3.png", "assets/Luau4.png"]
  },
  {
    name: "Spazio",
    images: ["assets/Spazio1.jpg", "assets/Spazio6.png", "assets/Spazio7.png"]
  }
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

      container.innerHTML = `
        <div class="rating-panel">
          <div class="stars">
            ${[1, 2, 3, 4, 5].map(i => `<div class="star" data-star="${i}"></div>`).join("")}
          </div>
        </div>
        <div class="card">
          <button class="prev"></button>
          <div class="image-slider"></div>
          <button class="next"></button>
          <span class="label">${est.name}</span>
        </div>
      `;

      const ratingPanel = container.querySelector(".rating-panel");
      const stars = container.querySelectorAll(".star");
      const slider = container.querySelector(".image-slider");
      const prevBtn = container.querySelector(".prev");
      const nextBtn = container.querySelector(".next");

      let currentImageIndex = 0;
      const images = est.images;

      function updateImage() {
        slider.style.backgroundImage = `url('${images[currentImageIndex]}')`;
        slider.style.backgroundSize = "cover";
        slider.style.backgroundPosition = "center";
        slider.style.backgroundRepeat = "no-repeat";
        prevBtn.style.display = currentImageIndex > 0 ? "block" : "none";
        nextBtn.style.display = currentImageIndex < images.length - 1 ? "block" : "none";
      }

      updateImage();

      prevBtn.addEventListener("click", e => {
        e.stopPropagation();
        if (currentImageIndex > 0) {
          currentImageIndex--;
          updateImage();
        }
      });

      nextBtn.addEventListener("click", e => {
        e.stopPropagation();
        if (currentImageIndex < images.length - 1) {
          currentImageIndex++;
          updateImage();
        }
      });

      container.addEventListener("click", function () {
        document.querySelectorAll(".rating-panel.open").forEach(panel => {
          if (!container.contains(panel)) {
            panel.classList.remove("open");
          }
        });
        ratingPanel.classList.toggle("open");
      });

      stars.forEach((star, index) => {
        star.addEventListener("click", function (e) {
          e.stopPropagation();
          stars.forEach((s, i) => {
            s.classList.toggle("active", i <= index);
          });
        });
      });

      list.appendChild(container);
    });
}

searchInput.addEventListener("input", () => {
  const search = searchInput.value.trim().toLowerCase();
  const filtered = establishments.filter(est => est.name.toLowerCase().includes(search));
  renderList(filtered);
});

renderList();
