# Pratidaan 🎓

> A premium campus marketplace built for students to sell, exchange, or give away resources — textbooks, electronics, tickets, notes, and skills.

Pratidaan is a modern, single-page React application designed with a stunning glassmorphic aesthetic. It operates completely in-memory without a backend, making it incredibly fast and perfect as a portfolio piece or template for building a larger marketplace.

## ✨ Features

- **Modern Glassmorphic UI:** Soft ambient backgrounds, translucent panels, and smooth micro-animations.
- **Bento Grid Layout:** A highly responsive masonry-style bento grid for exploring items with wide feature tiles.
- **Fully Featured Marketplace:**
  - **Shopping Cart & Checkout:** Add items with INR pricing to your cart and view your dynamic total.
  - **Wishlists:** Heart items to save them for later and quickly access them from the navigation bar.
  - **Real-time Search & Filtering:** Instantly filter items by categories or text search.
- **Simulated Chat System:** An in-memory messaging system that mimics real user interactions for item negotiation and coordination.
- **AI-Assisted Descriptions:** A "Generate with AI" button that auto-writes compelling listing descriptions (with fallback templating).
- **Responsive Design:** Completely optimized for both mobile and desktop experiences.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 8
- **Styling:** Tailwind CSS (v4), Custom Glassmorphism Utilities
- **Deployment:** Vercel (Zero-config)
- **Icons:** Custom SVG Components

## 🚀 Run Locally

Ensure you have Node.js 20.19+ or 22.12+ installed.

```bash
# Clone the repository
git clone https://github.com/shreyascode11/Pratidaan.git
cd Pratidaan

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open the URL printed in your terminal (usually `http://localhost:5173`) to view it in the browser.

## 🌐 Deploying to Vercel

Pratidaan is optimized for zero-configuration deployment on Vercel.

1. Push your code to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel will automatically detect **Vite** and configure the build settings (`npm run build`, `dist` folder).
4. Click **Deploy**.

## 🧠 AI Integration Note

The "Post an Item" form includes an AI description generator. By default, it uses a smart rule-based template generator so it works perfectly offline without any cost. 

If you want to use a real LLM (like OpenAI) for local experimentation:
1. Create a `.env.local` file in the root directory.
2. Add your key: `VITE_OPENAI_API_KEY=sk-...`

*(Warning: As this is a purely frontend application, never commit real, billable API keys to a public repository or deploy them to production without a backend proxy).*

## 📁 Project Structure

```text
src/
  App.jsx                       # Core state (Cart, Wishlist, Views, Auth)
  index.css                     # Theme tokens & Glassmorphism utilities
  data/seed.js                  # Initial dataset (25 campus-relevant items)
  utils/format.js               # INR currency formatting, relative dates, avatars
  utils/chatReplies.js          # Simulated chat response logic
  components/                   # Reusable UI components (Navbar, ItemCard, etc.)
```
