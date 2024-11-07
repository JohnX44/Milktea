const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use((req, res, next) => {
  res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' https://vercel.live 'unsafe-inline'"
  );
  next();
});


// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Use express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to make `cart` accessible in all views
app.use((req, res, next) => {
    res.locals.cart = req.session.cart || [];
    next();
});

// Route for the home page
app.get('/', (req, res) => {
  res.render('pages/home');
});

// Route to handle adding items to the cart
app.post('/add-to-cart', (req, res) => {
    const { productName, price, quantity } = req.body;

    // Initialize the cart if it doesn't exist
    if (!req.session.cart) {
        req.session.cart = [];
    }

    // Add the item to the cart
    req.session.cart.push({ productName, price, quantity });

    // Calculate updated cart count
    const cartCount = req.session.cart.reduce((acc, item) => acc + parseInt(item.quantity), 0);

    // Send JSON response
    res.json({ success: true, cartCount });
});
// Route for the cart page
app.get('/cart', (req, res) => {
  const cart = req.session.cart || [];
  res.render('partial/cart', { cart });
});

app.post('/remove-from-cart', (req, res) => {
    const { index } = req.body;
    if (req.session.cart) {
        req.session.cart.splice(index, 1); // Remove item at specified index
    }
    res.redirect('/cart');
});
app.post('/process-checkout', (req, res) => {
    const { firstName, lastName, address, gcashNumber } = req.body;

    // Mock payment processing logic
    if (gcashNumber) {
        // Confirm order processing here
        res.send('Thank you! Your order has been placed.');
    } else {
        res.status(400).send('Please enter a valid GCash number.');
    }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
