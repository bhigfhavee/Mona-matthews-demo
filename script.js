(() => {
  "use strict";

  const CART_KEY = "monaMatthewsCart";
  const WHATSAPP_NUMBER = "2348182999921";

  // GET CART
  function getCart() {
    try {
      const cart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      return Array.isArray(cart) ? cart : [];

    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // SAVE CART
  function saveCart(cart) {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );
  }

  // FORMAT PRICE
  function money(value) {
    return "₦" + Number(value || 0).toLocaleString("en-NG");
  }

  // UPDATE BAG COUNT
  function updateCartCount() {
    const count = getCart().reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    document.querySelectorAll(".cart-count").forEach(el => {
      el.textContent = count;
    });
  }

  // SAFE HTML
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  document.addEventListener("DOMContentLoaded", () => {

    updateCartCount();

    // =========================
    // SHOP FILTERS
    // =========================

    const filterButtons =
      document.querySelectorAll(".filter-btn");

    const productCards =
      document.querySelectorAll(".product-card");

    filterButtons.forEach(button => {

      button.addEventListener("click", () => {

        const category =
          (button.dataset.filter || "all").toLowerCase();

        filterButtons.forEach(btn => {
          btn.classList.toggle("active", btn === button);
        });

        productCards.forEach(card => {

          const productCategory =
            (card.dataset.category || "").toLowerCase();

          card.style.display =
            category === "all" ||
            productCategory === category
              ? ""
              : "none";

        });

      });

    });


    // =========================
    // ADD TO BAG
    // =========================

    document.querySelectorAll(".add-cart").forEach(button => {

      button.addEventListener("click", () => {

        const card = button.closest(".product-card");

        if (!card) return;

        const name =
          card.querySelector("h3")?.textContent.trim()
          || "Mona Matthews item";

        const image =
          card.querySelector("img")?.src || "";

        const category =
          card.dataset.category || "";

        const price = Number(
          String(button.dataset.price || "")
            .replace(/[^\d.]/g, "")
        );

        if (!Number.isFinite(price) || price <= 0) {
          alert("Product price is missing.");
          return;
        }

        const cart = getCart();

        const existing = cart.find(
          item => item.name === name
        );

        if (existing) {

          existing.quantity =
            Number(existing.quantity || 0) + 1;

        } else {

          cart.push({
            id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            name: name,
            image: image,
            category: category,
            price: price,
            quantity: 1
          });

        }

        saveCart(cart);

        updateCartCount();

        const oldText = button.textContent;

        button.textContent = "ADDED ✓";

        button.disabled = true;

        setTimeout(() => {

          button.textContent = oldText;

          button.disabled = false;

        }, 1000);

      });

    });


    // =========================
    // SHOPPING CART
    // =========================

    const cartContainer =
      document.getElementById("cart-items");

    if (cartContainer) {

      const totalElement =
        document.getElementById("cart-total");

      const subtotalElement =
        document.getElementById("cart-subtotal");


      function renderCart() {

        const cart = getCart();

        const itemCount = cart.reduce(
          (sum, item) =>
            sum + Number(item.quantity || 0),
          0
        );

        const subtotal = cart.reduce(
          (sum, item) =>
            sum +
            Number(item.price || 0) *
            Number(item.quantity || 0),
          0
        );

        if (totalElement) {
          totalElement.textContent =
            `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
        }

        if (subtotalElement) {
          subtotalElement.textContent = money(subtotal);
        }

        if (!cart.length) {

          cartContainer.innerHTML = `
            <div class="empty-cart">
              <h2>Your bag is waiting.</h2>

              <p>You haven't added any pieces yet.</p>

              <a href="shop.html" class="primary-btn">
                EXPLORE COLLECTION ↗
              </a>
            </div>
          `;

          updateCartCount();

          return;
        }


        cartContainer.innerHTML = cart.map(item => `

          <div class="cart-row"
               data-id="${escapeHTML(item.id)}">

            <img
              src="${escapeHTML(item.image)}"
              alt="${escapeHTML(item.name)}"
              class="cart-thumb">

            <div class="cart-product-details">

              <h3>${escapeHTML(item.name)}</h3>

              <p>${money(item.price)}</p>

              <div class="quantity-controls">

                <button
                  type="button"
                  class="decrease">
                  −
                </button>

                <span>
                  ${Number(item.quantity || 1)}
                </span>

                <button
                  type="button"
                  class="increase">
                  +
                </button>

              </div>

              <button
                type="button"
                class="remove-product">
                REMOVE
              </button>

            </div>

          </div>

        `).join("");

        updateCartCount();

      }


      // QUANTITY AND REMOVE BUTTONS

      cartContainer.addEventListener("click", event => {

        const row = event.target.closest(".cart-row");

        if (!row) return;

        const cart = getCart();

        const item = cart.find(
          product => String(product.id) === row.dataset.id
        );

        if (!item) return;

        let updatedCart = cart;

        if (event.target.closest(".increase")) {

          item.quantity =
            Number(item.quantity || 1) + 1;

        } else if (event.target.closest(".decrease")) {

          item.quantity =
            Number(item.quantity || 1) - 1;

          if (item.quantity <= 0) {

            updatedCart = cart.filter(
              product =>
                String(product.id) !== row.dataset.id
            );

          }

        } else if (event.target.closest(".remove-product")) {

          updatedCart = cart.filter(
            product =>
              String(product.id) !== row.dataset.id
          );

        } else {

          return;

        }

        saveCart(updatedCart);

        renderCart();

      });


      // =========================
      // WHATSAPP CHECKOUT
      // =========================

      const checkoutButton =
        document.getElementById("checkout-btn");

      if (checkoutButton) {

        checkoutButton.addEventListener("click", () => {

          const cart = getCart();

          if (!cart.length) {

            alert("Your shopping bag is empty.");

            return;

          }

          let total = 0;

          let message =
            "MONA MATTHEWS - ORDER ENQUIRY\n\n" +
            "Hello Mona Matthews,\n" +
            "I would like to enquire about ordering:\n\n";

          cart.forEach(item => {

            const lineTotal =
              Number(item.price) *
              Number(item.quantity);

            total += lineTotal;

            message +=
              `${item.name}\n` +
              `Quantity: ${item.quantity}\n` +
              `Unit price: ${money(item.price)}\n` +
              `Subtotal: ${money(lineTotal)}\n\n`;

          });

          message +=
            `TOTAL: ${money(total)}\n\n` +
            "Please contact me to confirm availability " +
            "and delivery. Thank you.";

          const whatsappURL =
            "https://wa.me/" +
            WHATSAPP_NUMBER +
            "?text=" +
            encodeURIComponent(message);

          window.open(
            whatsappURL,
            "_blank",
            "noopener"
          );

        });

      }

      renderCart();

    }


    // =========================
    // BESPOKE ENQUIRY FORM
    // =========================

    const bespokeForm =
      document.getElementById("bespoke-form");

    if (bespokeForm) {

      bespokeForm.addEventListener("submit", event => {

        event.preventDefault();

        if (!bespokeForm.reportValidity()) return;

        const getValue = id =>
          document.getElementById(id)?.value.trim() || "";

        const message = `
MONA MATTHEWS - BESPOKE ENQUIRY

Name: ${getValue("customer-name")}

Phone: ${getValue("customer-phone")}

Email: ${getValue("customer-email")}

Interest: ${getValue("customer-interest")}

Design description:
${getValue("customer-message")}

I look forward to hearing from you.
`;

        const whatsappURL =
          "https://wa.me/" +
          WHATSAPP_NUMBER +
          "?text=" +
          encodeURIComponent(message);

        window.open(
          whatsappURL,
          "_blank",
          "noopener"
        );

        const confirmation =
          document.getElementById("form-message");

        if (confirmation) {

          confirmation.textContent =
            "Your enquiry is ready. Please press Send in WhatsApp.";

        }

      });

    }

  });

})();