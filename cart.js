const cartItemsEl = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const itemCountEl = document.getElementById("itemCount");
const emptyCartEl = document.getElementById("emptyCart");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  cartItemsEl.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    document.querySelector(".cart-container").style.display = "none";
    emptyCartEl.style.display = "block";
    updateCartCount();
    return;
  }

  emptyCartEl.style.display = "none";

  cart.forEach((id, index) => {
    const item = albumsData.find(a => a.id === id);
    if (!item) return;

    total += parseInt(item.price.replace("₹",""));

    cartItemsEl.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <div class="cart-info">
          <h4>${item.title}</h4>
          <p>${item.artist}</p>
        </div>
        <div class="cart-price">${item.price}</div>
        <button class="remove-btn" onclick="removeItem(${index})">✕</button>
      </div>
    `;
  });

  totalPriceEl.textContent = `₹${total}`;
  itemCountEl.textContent = cart.length;
  updateCartCount();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = `(${cart.length})`;
}

renderCart();
