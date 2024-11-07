document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    // Initialize cart in session storage if it doesn't exist
    function initializeCart() {
        if (!sessionStorage.getItem("cart")) {
            sessionStorage.setItem("cart", JSON.stringify([]));
        }
    }
    initializeCart(); // Call it once on load

    // Select all product cards with quantity controls and set up event listeners for each
    document.querySelectorAll(".milk-tea-card").forEach((card, index) => {
        console.log(`Setting up quantity control for item #${index + 1}`);

        // Find elements within each product card
        const decreaseBtn = card.querySelector(".decrease-qty");
        const increaseBtn = card.querySelector(".increase-qty");
        const quantityInput = card.querySelector(".quantity-input");
        const form = card.querySelector(".add-to-cart-form");
        const hiddenQuantityInput = form ? form.querySelector(".hidden-quantity") : null;
        const productName = form ? form.querySelector("input[name='productName']").value : "";
        const productPrice = parseFloat(form ? form.querySelector("input[name='price']").value : "0");

        // Check if all required elements are present
        if (decreaseBtn && increaseBtn && quantityInput && hiddenQuantityInput) {
            console.log("All elements found for this item.");

            // Decrease quantity button
            decreaseBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantity -= 1;
                    quantityInput.value = quantity;
                    hiddenQuantityInput.value = quantity;
                    console.log(`Quantity decreased to: ${quantity} for item #${index + 1}`);
                }
            });

            // Increase quantity button
            increaseBtn.addEventListener("click", (e) => {
                e.preventDefault();
                let quantity = parseInt(quantityInput.value);
                quantity += 1;
                quantityInput.value = quantity;
                hiddenQuantityInput.value = quantity;
                console.log(`Quantity increased to: ${quantity} for item #${index + 1}`);
            });

            // Add to Cart - Cart animation, store in session storage, and update cart count
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                console.log(`Adding to cart with quantity: ${hiddenQuantityInput.value} for item #${index + 1}`);

                // Trigger the flying cart icon animation
                animateCartIcon(card);

                // Add item to cart in session storage
                addToCart(productName, productPrice, hiddenQuantityInput.value);
            });
        } else {
            console.log(`Some quantity control elements are missing for item #${index + 1}`);
        }
    });

    // Function to animate a flying cart icon to the cart icon
    function animateCartIcon(card) {
        const addToCartButton = card.querySelector("form button[type='submit']");
    
        // Check if addToCartButton exists
        if (!addToCartButton) {
            console.error("Add to Cart button not found.");
            return;
        }
    
        // Add green indicator and overlay message to the Add to Cart button
        addToCartButton.classList.add("added-to-cart");
    
        // Create an overlay message element
        const overlayMessage = document.createElement("span");
        overlayMessage.classList.add("overlay-message");
        overlayMessage.textContent = "Added!";
        addToCartButton.appendChild(overlayMessage);
    
        // Remove green indicator and overlay message after 1 second
        setTimeout(() => {
            addToCartButton.classList.remove("added-to-cart");
            overlayMessage.remove();
        }, 1000);
    
        // Create a flying cart icon element
        const flyingCartIcon = document.createElement("div");
        flyingCartIcon.innerHTML = "🛒";
        flyingCartIcon.classList.add("flying-cart-icon");
        document.body.appendChild(flyingCartIcon);
    
        // Get positions for animation
        const cartIcon = document.querySelector(".cart-icon");
    
        // Check if cartIcon exists
        if (!cartIcon) {
            console.error("Cart icon not found.");
            flyingCartIcon.remove();
            return;
        }
    
        const cartIconPosition = cartIcon.getBoundingClientRect();
        const buttonPosition = addToCartButton.getBoundingClientRect();
    
        // Position the flying cart icon at the "Add to Cart" button
        flyingCartIcon.style.position = "absolute";
        flyingCartIcon.style.left = `${buttonPosition.left}px`;
        flyingCartIcon.style.top = `${buttonPosition.top}px`;
        flyingCartIcon.style.transition = "all 3.5s ease";
    
        // Animate the flying cart icon to the cart icon position
        setTimeout(() => {
            flyingCartIcon.style.left = `${cartIconPosition.left}px`;
            flyingCartIcon.style.top = `${cartIconPosition.top}px`;
            flyingCartIcon.style.transform = "scale(0.5)";
            flyingCartIcon.style.opacity = "0";
        }, 100);
    
        // Remove the flying cart icon after animation
        setTimeout(() => {
            flyingCartIcon.remove();
        }, 2000);
    }
    

    // Function to add item to cart in session storage
    function addToCart(name, price, quantity) {
        initializeCart(); // Ensure cart is initialized before accessing it

        const cart = JSON.parse(sessionStorage.getItem("cart")) || []; // Fallback to empty array if null
        cart.push({ name, price, quantity });
        sessionStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        console.log(`Added ${quantity} x ${name} to cart.`);
    }

    // Function to update cart count
    function updateCartCount() {
        initializeCart(); // Ensure cart is initialized before accessing it

        const cart = JSON.parse(sessionStorage.getItem("cart")) || []; // Fallback to empty array if null
        const cartCount = cart.reduce((acc, item) => acc + parseInt(item.quantity), 0);
        const cartCountElement = document.querySelector(".cart-count");
        if (cartCountElement) cartCountElement.textContent = cartCount;
    }

    // Initial call to set cart count on page load
    updateCartCount();

    // View Cart button to show cart contents and total price
    document.querySelector(".view-cart").addEventListener("click", () => {
        initializeCart(); // Ensure cart is initialized before accessing it

        const cart = JSON.parse(sessionStorage.getItem("cart")) || []; // Fallback to empty array if null
        let cartHTML = "";
        let totalPrice = 0;

        cart.forEach(item => {
            const itemTotalPrice = item.price * item.quantity;
            totalPrice += itemTotalPrice;
            cartHTML += `
                <div class="cart-item">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-quantity">Qty: ${item.quantity}</span>
                    <span class="cart-item-price">$${itemTotalPrice.toFixed(2)}</span>
                </div>
            `;
        });

        document.querySelector("#cartItemsList").innerHTML = cartHTML;
        document.querySelector("#totalPrice").textContent = totalPrice.toFixed(2);
        $("#cartModal").modal("show"); // Display the modal with cart contents
    });
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");

    function initializeCart() {
        if (!sessionStorage.getItem("cart")) {
            sessionStorage.setItem("cart", JSON.stringify([]));
        }
    }
    initializeCart();

    function updateCartCount() {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        const cartCount = cart.reduce((acc, item) => acc + parseInt(item.quantity), 0);
        const cartCountElement = document.querySelector(".cart-count");
        if (cartCountElement) cartCountElement.textContent = cartCount;
    }
    updateCartCount();

    document.querySelector(".view-cart").addEventListener("click", renderCartModal);

    function renderCartModal() {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        let cartHTML = "";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const itemTotalPrice = item.price * item.quantity;
            totalPrice += itemTotalPrice;
            cartHTML += `
               <div class="cart-item d-flex flex-column flex-md-row align-items-md-center py-2 border-bottom" data-index="${index}">
                <div class="cart-item-name col-12 col-md-4">${item.name}</div>
                <div class="cart-item-quantity col-12 col-md-4 mt-2 mt-md-0 d-flex justify-content-md-center align-items-center">
                    Qty: 
                    <input type="number" min="1" class="form-control form-control-sm ml-2 edit-quantity" value="${item.quantity}" data-index="${index}" style="width: 60px;">
                </div>
                <div class="cart-item-price col-12 col-md-4 mt-2 mt-md-0 d-flex justify-content-between justify-content-md-end align-items-center">
                    <span>$${itemTotalPrice.toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-danger delete-item ml-3" data-index="${index}">Delete</button>
                </div>
            </div>
            `;
        });

        document.querySelector("#cartItemsList").innerHTML = cartHTML;
        document.querySelector("#totalPrice").textContent = totalPrice.toFixed(2);

        // Attach event listeners to delete and edit buttons
        document.querySelectorAll(".delete-item").forEach(button => {
            button.addEventListener("click", handleDelete);
        });
        document.querySelectorAll(".edit-quantity").forEach(input => {
            input.addEventListener("change", handleEditQuantity);
        });

        $("#cartModal").modal("show");
    }

    function handleDelete(event) {
        const index = event.target.getAttribute("data-index");
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        cart.splice(index, 1); // Remove item from cart
        sessionStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        renderCartModal(); // Re-render modal with updated cart
    }

    function handleEditQuantity(event) {
        const index = event.target.getAttribute("data-index");
        const newQuantity = parseInt(event.target.value);
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
            sessionStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            renderCartModal(); // Re-render modal to update total price
        }
    }

    // Other existing functions (e.g., animateCartIcon, addToCart, etc.)
    function addToCart(name, price, quantity) {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        cart.push({ name, price, quantity });
        sessionStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const proceedToCheckoutButton = document.getElementById("proceedToCheckout");
    const proceedToSummaryButton = document.getElementById("proceedToSummary");
    const backToCartButton = document.getElementById("backToCart");
    const backToCheckoutButton = document.getElementById("backToCheckout");
    const confirmPurchaseButton = document.getElementById("confirmPurchase");
    const checkoutForm = document.getElementById("checkoutForm");

    const cartView = document.getElementById("cartView");
    const checkoutView = document.getElementById("checkoutView");
    const summaryView = document.getElementById("summaryView");

    // Validate GCash Number Input
    const gcashNumberInput = document.getElementById("gcashNumber");
    function validateGcashNumber(input) {
        input.value = input.value.replace(/[^0-9]/g, ''); // Allow only numbers
        if (input.value.length >= 10 && input.value.length <= 11) {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
        } else {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
        }
        toggleConfirmButton();
    }

    // Enable Confirm Purchase Button only when form is complete
    function toggleConfirmButton() {
        confirmPurchaseButton.disabled = !checkoutForm.checkValidity();
    }

    gcashNumberInput.addEventListener("input", () => validateGcashNumber(gcashNumberInput));

    // Proceed to Checkout View
    proceedToCheckoutButton.addEventListener("click", () => {
        cartView.classList.add("d-none");
        checkoutView.classList.remove("d-none");
    });

    // Proceed to Summary View
    proceedToSummaryButton.addEventListener("click", () => {
        populateOrderSummary();
        checkoutView.classList.add("d-none");
        summaryView.classList.remove("d-none");
    });

    // Back to Cart View
    backToCartButton.addEventListener("click", () => {
        checkoutView.classList.add("d-none");
        cartView.classList.remove("d-none");
    });

    // Back to Checkout View
    backToCheckoutButton.addEventListener("click", () => {
        summaryView.classList.add("d-none");
        checkoutView.classList.remove("d-none");
    });

    // Confirm Purchase Flow
    confirmPurchaseButton.addEventListener("click", () => {
        $('#balanceModal').modal('show'); // Show balance check modal
    });

    // Simulate Balance Check in Balance Modal
    document.getElementById("confirmBalanceCheck").addEventListener("click", () => {
        const hasEnoughBalance = Math.random() > 0.3; // Randomly simulate balance check (70% chance of success)
        
        if (hasEnoughBalance) {
            showThankYouMessage();
            clearCart();
        } else {
            alert("Transaction failed: Insufficient balance in GCash.");
        }
        $('#balanceModal').modal('hide');
    });

    // Clear Cart After Successful Purchase
    function clearCart() {
        sessionStorage.removeItem("cart"); // Clear cart from storage
        document.getElementById("cartItemsList").innerHTML = ""; // Clear cart items display
        document.getElementById("totalPrice").textContent = "0.00"; // Reset total price in cart view
        document.getElementById("summaryTotalPrice").textContent = "0.00"; // Reset total price in summary view
    }
    function clearCart() {
        sessionStorage.removeItem("cart"); // Clear cart from storage
        document.getElementById("cartItemsList").innerHTML = ""; // Clear cart items display
        document.getElementById("totalPrice").textContent = "0.00"; // Reset total price in cart view
        document.getElementById("summaryTotalPrice").textContent = "0.00"; // Reset total price in summary view
    
        // Reset the cart count in the navbar
        document.querySelector(".cart-count").textContent = "0";
    }
    
    // Show Thank You Message
    function showThankYouMessage() {
        // Show the Thank You modal
        $('#thankYouModal').modal('show');
        
        // Hide the cart modal after showing the thank you message
        $('#cartModal').modal('hide');
    }
    

    // Reset modal to cart view when closed
    $('#cartModal').on('hidden.bs.modal', function () {
        summaryView.classList.add("d-none");
        checkoutView.classList.add("d-none");
        cartView.classList.remove("d-none");
    });

    function populateOrderSummary() {
        const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
        let orderSummaryHTML = "";
        let totalPrice = 0;

        cart.forEach(item => {
            const itemTotalPrice = item.price * item.quantity;
            totalPrice += itemTotalPrice;
            orderSummaryHTML += `
                <div class="cart-item d-flex justify-content-between">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${itemTotalPrice.toFixed(2)}</span>
                </div>
            `;
        });

        // Populate items in the summary
        document.getElementById("orderSummaryItems").innerHTML = orderSummaryHTML;

        // Update the total price in both Cart View and Summary View
        document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);
        document.getElementById("summaryTotalPrice").textContent = totalPrice.toFixed(2);

        // Populate delivery information
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const address = document.getElementById("address").value;
        const gcashNumber = document.getElementById("gcashNumber").value;

        document.getElementById("summaryDeliveryInfo").textContent = `${firstName} ${lastName}, ${address}`;
        document.getElementById("summaryGcashNumber").textContent = gcashNumber;
    }
});
 // JavaScript to observe elements and add fade-in effect on scroll
document.addEventListener("DOMContentLoaded", () => {
    const fadeElements = document.querySelectorAll(".fade-in-element");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                observer.unobserve(entry.target); // Stop observing once element is in view
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
});
