
(() => {
    "use strict";

    const CART_KEY = "monaMatthewsCart";
    const MAX_QUANTITY = 99;

    // -------------------------
    // GENERAL UTILITIES
    // -------------------------

    function safeImageURL(value) {
        if (typeof value !== "string" || !value.trim()) {
            return "";
        }

        try {
            const url = new URL(value, window.location.href);

            if (url.protocol === "http:" || url.protocol === "https:") {
                return url.href;
            }
        } catch (error) {
            console.warn("Invalid image URL:", error);
        }

        return "";
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function money(value) {
        return "₦" + Number(value || 0).toLocaleString("en-NG");
    }

    // -------------------------
    // CART VALIDATION
    // -------------------------

    function isValidCartItem(item) {
        return Boolean(
            item &&
            typeof item.id === "string" &&
            item.id.trim() &&
            typeof item.name === "string" &&
            item.name.trim() &&
            Number.isFinite(Number(item.price)) &&
            Number(item.price) > 0 &&
            Number.isInteger(Number(item.quantity)) &&
            Number(item.quantity) > 0 &&
            Number(item.quantity) <= MAX_QUANTITY
        );
    }

    function getCart() {
        try {
            const storedCart = localStorage.getItem(CART_KEY);

            if (!storedCart) {
                return [];
            }

            const parsedCart = JSON.parse(storedCart);

            if (!Array.isArray(parsedCart)) {
                return [];
            }

            return parsedCart
                .filter(isValidCartItem)
                .map(item => ({
                    id: item.id,
                    name: item.name,
                    image: safeImageURL(item.image),
                    category: String(item.category || ""),
                    price: Number(item.price),
                    quantity: Number(item.quantity)
                }));
        } catch (error) {
            console.error("Unable to read shopping bag:", error);
            return [];
        }
    }

    function saveCart(cart) {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            return true;
        } catch (error) {
            console.error("Unable to save shopping bag:", error);
            return false;
        }
    }

    function updateCartCount() {
        const count = getCart().reduce(
            (total, item) => total + item.quantity,
            0
        );

        document.querySelectorAll(".cart-count").forEach(element => {
            element.textContent = count;
        });
    }

    function showCartMessage(message) {
        let status = document.getElementById("cart-status");

        if (!status) {
            status = document.createElement("p");
            status.id = "cart-status";
            status.setAttribute("role", "status");
            status.setAttribute("aria-live", "polite");

            const summary = document.querySelector(".cart-summary");

            if (summary) {
                summary.appendChild(status);
            }
        }

        if (status) {
            status.textContent = message;
        }
    }

    // -------------------------
    // SHOP CATEGORY FILTERS
    // -------------------------

    function initialiseFilters() {
        const filterButtons = document.querySelectorAll(".filter-btn");
        const productCards = document.querySelectorAll(".product-card");

        if (!filterButtons.length || !productCards.length) {
            return;
        }

        function applyFilter(category) {
            const allowedCategories = ["all", "women", "men", "bags"];

            const selectedCategory = allowedCategories.includes(category)
                ? category
                : "all";

            filterButtons.forEach(button => {
                const isActive =
                    button.dataset.filter === selectedCategory;

                button.classList.toggle("active", isActive);
                button.setAttribute("aria-pressed", String(isActive));
            });

            productCards.forEach(card => {
                const productCategory =
                    (card.dataset.category || "").toLowerCase();

                const matches =
                    selectedCategory === "all" ||
                    productCategory === selectedCategory;

                card.style.display = matches ? "" : "none";
            });
        }

        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                applyFilter(
                    (button.dataset.filter || "all").toLowerCase()
                );
            });
        });

        const requestedCategory = new URLSearchParams(
            window.location.search
        ).get("category");

        applyFilter((requestedCategory || "all").toLowerCase());
    }

    // -------------------------
    // ADD PRODUCTS TO BAG
    // -------------------------

    function initialiseAddToBag() {
        document.querySelectorAll(".add-cart").forEach(button => {
            button.addEventListener("click", () => {
                const productCard = button.closest(".product-card");

                if (!productCard) {
                    return;
                }

                const productId = button.dataset.productId;
                const productName =
                    productCard.querySelector("h3")?.textContent.trim();

                const productImage = safeImageURL(
                    productCard.querySelector("img")?.src || ""
                );

                const productCategory =
                    (productCard.dataset.category || "").toLowerCase();

                const productPrice = Number(button.dataset.price);

                if (
                    !productId ||
                    !productName ||
                    !Number.isFinite(productPrice) ||
                    productPrice <= 0
                ) {
                    window.alert(
                        "This demonstration product has incomplete information."
                    );
                    return;
                }

                const cart = getCart();

                const existingItem = cart.find(
                    item => item.id === productId
                );

                if (existingItem) {
                    if (existingItem.quantity >= MAX_QUANTITY) {
                        window.alert(
                            "The maximum demonstration quantity has been reached."
                        );
                        return;
                    }

                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: productId,
                        name: productName,
                        image: productImage,
                        category: productCategory,
                        price: productPrice,
                        quantity: 1
                    });
                }

                if (!saveCart(cart)) {
                    window.alert(
                        "Your browser could not save the shopping bag. Check your browser storage settings and try again."
                    );
                    return;
                }

                updateCartCount();

                const originalText = button.textContent;

                button.textContent = "ADDED";
                button.disabled = true;

                window.setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 900);
            });
        });
    }

    // -------------------------
    // SHOPPING BAG PAGE
    // -------------------------

    function initialiseCart() {
        const cartContainer = document.getElementById("cart-items");

        if (!cartContainer) {
            return;
        }

        const itemCountElement = document.getElementById("cart-total");
        const subtotalElement = document.getElementById("cart-subtotal");
        const checkoutButton = document.getElementById("checkout-btn");

        function renderCart() {
            const cart = getCart();

            const itemCount = cart.reduce(
                (total, item) => total + item.quantity,
                0
            );

            const subtotal = cart.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );

            if (itemCountElement) {
                itemCountElement.textContent =
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

                        <a href="./shop.html" class="primary-btn">
                            EXPLORE COLLECTION
                        </a>
                    </div>
                `;

                if (checkoutButton) {
                    checkoutButton.disabled = true;
                }

                updateCartCount();
                return;
            }

            if (checkoutButton) {
                checkoutButton.disabled = false;
            }

            cartContainer.innerHTML = cart.map(item => {
                const imageMarkup = item.image
                    ? `
                        <img
                            src="${escapeHTML(item.image)}"
                            alt="${escapeHTML(item.name)}"
                            class="cart-thumb"
                            loading="lazy">
                    `
                    : "";

                return `
                    <div class="cart-row" data-id="${escapeHTML(item.id)}">

                        ${imageMarkup}

                        <div class="cart-product-details">

                            <h3>${escapeHTML(item.name)}</h3>

                            <p>${money(item.price)}</p>

                            <div class="quantity-controls">

                                <button
                                    type="button"
                                    class="decrease"
                                    aria-label="Decrease quantity of ${escapeHTML(item.name)}">
                                    −
                                </button>

                                <span>${item.quantity}</span>

                                <button
                                    type="button"
                                    class="increase"
                                    aria-label="Increase quantity of ${escapeHTML(item.name)}">
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
                `;
            }).join("");

            updateCartCount();
        }

        cartContainer.addEventListener("click", event => {
            const target = event.target;

            if (!(target instanceof Element)) {
                return;
            }

            const row = target.closest(".cart-row");

            if (!row) {
                return;
            }

            const productId = row.dataset.id;
            const cart = getCart();

            const item = cart.find(
                product => product.id === productId
            );

            if (!item) {
                return;
            }

            let updatedCart = cart;

            if (target.closest(".increase")) {
                if (item.quantity >= MAX_QUANTITY) {
                    showCartMessage(
                        "The maximum demonstration quantity has been reached."
                    );
                    return;
                }

                item.quantity += 1;

            } else if (target.closest(".decrease")) {
                item.quantity -= 1;

                if (item.quantity <= 0) {
                    updatedCart = cart.filter(
                        product => product.id !== productId
                    );
                }

            } else if (target.closest(".remove-product")) {
                updatedCart = cart.filter(
                    product => product.id !== productId
                );

            } else {
                return;
            }

            if (!saveCart(updatedCart)) {
                showCartMessage(
                    "Unable to update your bag. Check your browser storage settings."
                );
                return;
            }

            showCartMessage("");
            renderCart();
        });

        if (checkoutButton) {
            checkoutButton.addEventListener("click", () => {
                if (!getCart().length) {
                    showCartMessage("Your shopping bag is empty.");
                    return;
                }

                showCartMessage(
                    "Demonstration only: checkout is not connected. No order has been submitted and no payment has been processed."
                );
            });
        }

        renderCart();
    }

    // -------------------------
    // BESPOKE ENQUIRY FORM
    // -------------------------

    function initialiseBespokeForm() {
        const form = document.getElementById("bespoke-form");

        if (!form) {
            return;
        }

        form.addEventListener("submit", event => {
            event.preventDefault();

            if (!form.reportValidity()) {
                return;
            }

            const confirmation =
                document.getElementById("form-message");

            if (confirmation) {
                confirmation.textContent =
                    "Demonstration only: this enquiry form is not connected. Your details have not been sent to Mona Matthews.";

                confirmation.setAttribute("role", "status");
                confirmation.setAttribute("aria-live", "polite");
            }
        });
    }

    // -------------------------
    // APPLICATION INITIALISATION
    // -------------------------

    document.addEventListener("DOMContentLoaded", () => {
        updateCartCount();
        initialiseFilters();
        initialiseAddToBag();
        initialiseCart();
        initialiseBespokeForm();
    });

    // Keep bag counts in sync across browser tabs.
    window.addEventListener("storage", event => {
        if (event.key === CART_KEY) {
            updateCartCount();
        }
    });

})();
