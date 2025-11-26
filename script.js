// ✅ Load products from backend and display them
async function loadProducts() {
  const container = document.getElementById("product-list");

  try {
    const response = await fetch("https://habibi-drip-backend.onrender.com/");
    const products = await response.json();

    products.forEach(product => {
      const mockup = product.variants[0].images[0].src;
      const title = product.title;
      const price = product.variants[0].price / 100;
      const productId = product.id;
      const variantId = product.variants[0].id;

      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${mockup}" alt="${title}" />
        <h3>${title}</h3>
        <p>${price} DKK</p>
        <button onclick="addToCart('${productId}', '${variantId}', '${title}', ${price})">Add to Cart</button>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// ✅ Cart logic
let cart = [];

function addToCart(productId, variantId, title, price) {
  cart.push({ productId, variantId, title, price });
  localStorage.setItem("habibiCart", JSON.stringify(cart));
  alert(`${title} added to cart`);
}

// ✅ Load cart on cart.html
function loadCart() {
  const container = document.getElementById("cart-items");
  cart = JSON.parse(localStorage.getItem("habibiCart")) || [];

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <span>${item.title}</span>
      <span>${item.price} DKK</span>
    `;
    container.appendChild(row);
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById("cart-total").innerText = `${total} DKK`;
}

// ✅ Trigger order creation (after PayPal)
async function placeOrder(customer) {
  cart = JSON.parse(localStorage.getItem("habibiCart")) || [];
  if (cart.length === 0) return alert("Cart is empty");

  const item = cart[0]; // single item for now

  try {
    const response = await fetch("http://localhost:3000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: item.productId,
        variant_id: item.variantId,
        customer
      })
    });

    const data = await response.json();
    console.log("Order created:", data);
    localStorage.removeItem("habibiCart");
    window.location.href = "success.html";

  } catch (err) {
    console.error("Order failed:", err);
    alert("Order failed");
  }
}

