const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const header = document.querySelector(".site-header");
const filterButtons = document.querySelectorAll(".filter-button");
const productCards = document.querySelectorAll(".product-card");
const revealItems = document.querySelectorAll(".reveal");
const orderButtons = document.querySelectorAll(".order-button");
const orderModal = document.querySelector("#order-modal");
const orderForm = document.querySelector("#order-form");
const modalClose = document.querySelector(".modal-close");
const modalImage = document.querySelector("#modal-image");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalPrice = document.querySelector("#modal-price");
const orderTotal = document.querySelector("#order-total");
const quantityValue = document.querySelector("#quantity-value");
const quantityMinus = document.querySelector("#quantity-minus");
const quantityPlus = document.querySelector("#quantity-plus");
const whatsappNumber = "51999999999";
let currentPrice = 0;
let currentQuantity = 1;

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  navigation.classList.toggle("open");
  document.body.classList.toggle("menu-open");
});

navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 60);
}, { passive: true });

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    productCards.forEach((card) => {
      const matches = button.dataset.filter === "todos" || card.dataset.category === button.dataset.filter;
      card.classList.toggle("hidden", !matches);
    });
  });
});

function updateTotal() {
  quantityValue.textContent = currentQuantity;
  orderTotal.textContent = `S/ ${currentPrice * currentQuantity}`;
  quantityMinus.disabled = currentQuantity === 1;
}

orderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const image = card.querySelector("img");
    const title = card.querySelector("h3").textContent;
    const description = card.querySelector(":scope > p").textContent;
    const priceText = card.querySelector(".product-info > strong").textContent;

    currentPrice = Number(priceText.replace(/\D/g, ""));
    currentQuantity = 1;
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalPrice.textContent = priceText;
    updateTotal();
    orderModal.showModal();
  });
});

quantityMinus.addEventListener("click", () => {
  currentQuantity = Math.max(1, currentQuantity - 1);
  updateTotal();
});

quantityPlus.addEventListener("click", () => {
  currentQuantity += 1;
  updateTotal();
});

modalClose.addEventListener("click", () => orderModal.close());
orderModal.addEventListener("click", (event) => {
  if (event.target === orderModal) orderModal.close();
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const customerName = document.querySelector("#customer-name").value.trim();
  const notes = document.querySelector("#order-notes").value.trim();
  const message = [
    "Hola Natural Coffee, quiero hacer un pedido:",
    "",
    `Producto: ${modalTitle.textContent}`,
    `Cantidad: ${currentQuantity}`,
    `Total: S/ ${currentPrice * currentQuantity}`,
    `Nombre: ${customerName}`,
    notes ? `Indicaciones: ${notes}` : ""
  ].filter(Boolean).join("\n");

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));
document.querySelector("#year").textContent = new Date().getFullYear();
