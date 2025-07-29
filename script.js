/*
 * Funktionalitet för GymSupps e-handelssida.
 * Definierar produktlistan, hanterar varukorg och checkout.
 */

// Produktkatalog – ändra dessa vid behov.
const products = [
  {
    id: 1,
    name: 'Proteinpulver Vanilj',
    description: 'Högkvalitativt vassleprotein med krämig vaniljsmak.',
    price: 249,
    rating: 5,
    image: 'images/protein.png' // byt ut mot din egen bild
  },
  {
    id: 2,
    name: 'BCAA',
    description: 'Grenade aminosyror för återhämtning och muskeluppbyggnad.',
    price: 189,
    rating: 4,
    image: 'images/bcaa.png'
  },
  {
    id: 3,
    name: 'Kreatin Monohydrat',
    description: 'Öka styrka och explosivitet med rent kreatin.',
    price: 149,
    rating: 4,
    image: 'images/kreatin.png'
  },
  {
    id: 4,
    name: 'Omega‑3',
    description: 'Essentiella fettsyror för hjärta och leder.',
    price: 199,
    rating: 5,
    image: 'images/omega3.png'
  },
  {
    id: 5,
    name: 'Multivitamin',
    description: 'Komplett multivitamin för dagligt välbefinnande.',
    price: 99,
    rating: 4,
    image: 'images/multivitamin.png'
  },
  {
    id: 6,
    name: 'PWO – Pre Workout',
    description: 'Energiboost inför träningspasset.',
    price: 279,
    rating: 5,
    image: 'images/pwo.png'
  },
  {
    id: 7,
    name: 'Gainer',
    description: 'Kaloririkt tillskott för viktuppgång och muskelmassa.',
    price: 299,
    rating: 3,
    image: 'images/gainer.png'
  },
  {
    id: 8,
    name: 'Vitamin D3',
    description: 'Stöd för immunförsvaret och benhälsa.',
    price: 79,
    rating: 4,
    image: 'images/vitaminD.png'
  },
  {
    id: 9,
    name: 'ZMA',
    description: 'Mineralkomplex för sömn och återhämtning.',
    price: 159,
    rating: 4,
    image: 'images/zma.png'
  },
  {
    id: 10,
    name: 'Kollagenpulver',
    description: 'Främjar hud, hår och leder med hydrolyserat kollagen.',
    price: 229,
    rating: 4,
    image: 'images/kollagen.png'
  }
];

// Varukorgens innehåll
let cart = [];

// Läs varukorg från localStorage
function loadCart() {
  try {
    const saved = localStorage.getItem('gymSuppsCart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Kunde inte läsa varukorg från localStorage', e);
  }
}

// Rendera produkter
function renderProducts() {
  const productList = document.getElementById('product-list');
  if (!productList) return;
  productList.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.classList.add('product-image');
    card.appendChild(img);

    const info = document.createElement('div');
    info.classList.add('product-info');

    const title = document.createElement('h3');
    title.textContent = product.name;
    info.appendChild(title);

    const price = document.createElement('p');
    price.textContent = `${product.price} kr`;
    price.classList.add('price');
    info.appendChild(price);

    const stars = document.createElement('div');
    stars.classList.add('stars');
    stars.innerHTML = renderStars(product.rating);
    info.appendChild(stars);

    const btn = document.createElement('button');
    btn.classList.add('btn-primary');
    btn.textContent = 'Lägg i varukorg';
    btn.addEventListener('click', () => addToCart(product.id));
    info.appendChild(btn);

    card.appendChild(info);
    productList.appendChild(card);
  });
}

// Rendera stjärnor
function renderStars(rating) {
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    starsHTML += i <= rating
      ? '<i class="fa-solid fa-star"></i>'
      : '<i class="fa-regular fa-star"></i>';
  }
  return starsHTML;
}

// Lägg till produkt i varukorg
function addToCart(productId) {
  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ productId, qty: 1 });
  }
  updateCartDisplay();
}

// Öka/minska/ta bort produkter
function increaseQty(productId) {
  const item = cart.find((i) => i.productId === productId);
  if (item) {
    item.qty += 1;
    updateCartDisplay();
  }
}
function decreaseQty(productId) {
  const item = cart.find((i) => i.productId === productId);
  if (item) {
    item.qty -= 1;
    if (item.qty <= 0) {
      removeFromCart(productId);
    } else {
      updateCartDisplay();
    }
  }
}
function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  updateCartDisplay();
}

// Antal och total
function countCartItems() {
  return cart.reduce((total, item) => total + item.qty, 0);
}
function calculateTotal() {
  return cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + product.price * item.qty;
  }, 0);
}

// Uppdatera varukorgens utseende
function updateCartDisplay() {
  document.getElementById('cart-count').textContent = countCartItems();

  const cartItemsDiv = document.getElementById('cart-items');
  if (cartItemsDiv) {
    cartItemsDiv.innerHTML = '';
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Din varukorg är tom.</p>';
    } else {
      cart.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');

        const img = document.createElement('img');
        img.src = product.image;
        img.alt = product.name;
        itemDiv.appendChild(img);

        const details = document.createElement('div');
        details.classList.add('cart-item-details');
        const h4 = document.createElement('h4');
        h4.textContent = product.name;
        details.appendChild(h4);
        const priceSpan = document.createElement('div');
        priceSpan.classList.add('cart-price');
        priceSpan.textContent = `${product.price * item.qty} kr`;
        details.appendChild(priceSpan);
        itemDiv.appendChild(details);

        const controls = document.createElement('div');
        controls.classList.add('cart-item-controls');

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.addEventListener('click', () => decreaseQty(item.productId));
        controls.appendChild(minusBtn);

        const qtySpan = document.createElement('span');
        qtySpan.textContent = item.qty;
        controls.appendChild(qtySpan);

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.addEventListener('click', () => increaseQty(item.productId));
        controls.appendChild(plusBtn);

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        removeBtn.addEventListener('click', () => removeFromCart(item.productId));
        controls.appendChild(removeBtn);

        itemDiv.appendChild(controls);
        cartItemsDiv.appendChild(itemDiv);
      });
    }
  }
  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = `${calculateTotal()} kr`;

  // Spara varukorg
  try {
    localStorage.setItem('gymSuppsCart', JSON.stringify(cart));
  } catch (e) {
    console.warn('Kunde inte spara varukorg', e);
  }
}

// Händelser för varukorg och checkout
const cartOverlay = document.getElementById('cart-overlay');
const checkoutModal = document.getElementById('checkout-modal');

const cartButton = document.getElementById('cartButton');
const closeCartButtons = document.querySelectorAll('#closeCart');
cartButton?.addEventListener('click', () => {
  if (cartOverlay) {
    cartOverlay.style.display = 'flex';
    updateCartDisplay();
  }
});
closeCartButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (cartOverlay) cartOverlay.style.display = 'none';
  });
});
if (cartOverlay) {
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) {
      cartOverlay.style.display = 'none';
    }
  });
}

const checkoutBtn = document.getElementById('checkoutBtn');
const closeCheckoutButtons = document.querySelectorAll('#closeCheckout');
checkoutBtn?.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Din varukorg är tom. Lägg till varor innan du går till kassan.');
    return;
  }
  if (checkoutModal) checkoutModal.style.display = 'flex';
  if (cartOverlay) cartOverlay.style.display = 'none';
});
closeCheckoutButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (checkoutModal) checkoutModal.style.display = 'none';
  });
});
if (checkoutModal) {
  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
      checkoutModal.style.display = 'none';
    }
  });
}

// Hantera checkout-formuläret
const checkoutForm = document.getElementById('checkout-form');
checkoutForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  alert(
    `Tack för din beställning, ${name}!\\nDu får en orderbekräftelse via e-post.`
  );
  cart = [];
  updateCartDisplay();
  if (checkoutModal) checkoutModal.style.display = 'none';
});

// Sätt årtal i footer och initiera sidan
document.getElementById('year').textContent = new Date().getFullYear();

loadCart();
renderProducts();
updateCartDisplay();
