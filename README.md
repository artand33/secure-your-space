# SecureYourSpace (SecureGuard Systems)

Welcome to the **SecureYourSpace** project repo. This is a high-performance, conversion-optimized marketing landing page for **SecureGuard Systems**, a leading provider of premium security solutions—including CCTV, Access Control, and advanced surveillance infrastructure.

Designed for developers, this project leverages a modern, scalable frontend architecture focused on visual excellence and technical performance.

---

## 🚀 Key Features

- **Premium UI/UX**: Built with a "Secure & Modern" aesthetic, utilizing glassmorphism, smooth transitions, and high-quality iconography.
- **Component-Driven Architecture**: Modular parts (Hero, Services, Social Proof, FAQ) allow for easy updates and scalability.
- **SEO & Social Optimization**: Implemented custom metadata for Google SEO, Open Graph (Facebook/LinkedIn/Discord), and Twitter Cards.
- **Form-Ready Branding**: Integrated with React Hook Form and Zod for future-proof lead generation and contact intake.
- **Performance Focused**: Minimal bundle size using Vite, with fast asset loading and optimized images.

---

## 🛠 Technology Stack

### Core
- **Framework**: [Vite](https://vitejs.dev/) + [React 18](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)

### Styling & UI
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Design System**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: `tailwindcss-animate` + Embla Carousel for dynamic sliders.

### Technical Infrastructure
- **State Management**: [TanStack React Query v5](https://tanstack.com/query)
- **Form Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Testing**: 
  - **Unit**: [Vitest](https://vitest.dev/)
  - **E2E**: [Playwright](https://playwright.dev/)
- **Analytics**: Vercel Analytics

---

## 📦 Project Structure

```bash
├── public/                # Static assets & SEO (favicons, robots.txt, og-image.png)
├── src/
│   ├── components/
│   │   ├── ui/            # Reusable UI primitives (shadcn)
│   │   ├── sections/      # High-level page sections (Hero, FAQ, etc.)
│   │   └── NavLink.tsx    # Specific navigation components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions (utils.ts, queryClient)
│   ├── pages/             # Application views (Index, NotFound)
│   ├── test/              # Testing configurations and mocks
│   ├── App.tsx            # Main App container & Route definitions
│   └── main.tsx           # Entry point
```

---

## 💻 Local Development

### Prerequisites
Ensure you have **Node.js** (v18+) and a package manager like **npm**, **pnpm**, or **bun** installed.

### Setup Instructions

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd secure-your-space
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Access the app at `http://localhost:8080` (default Vite port).

4.  **Lint & Check Types**
    ```bash
    npm run lint
    # or
    npx tsc --noEmit
    ```

5.  **Run Tests**
    ```bash
    npm run test        # Unit tests
    npx playwright test # E2E tests
    ```

---

## 🌐 Deployment (Lovable or Vercel/Netlify)

This project is built to be deployed seamlessly.

- **To deploy via Lovable**: Click on **Share -> Publish** within the Lovable interface.
- **Continuous Deployment**: Any push to the `main` branch can trigger an automatic build if connected to Vercel or Netlify.

---

## 📈 SEO & Metadata
The project includes a robust metadata implementation (Social Proof & SEO). 
Specific details for refinement are documented in `Implementation/IMPLEMENTATION_METADA.md`, including Open Graph images and Twitter Card configuration.

---

## 📄 License
This project is private and intended for the specific use of **SecureGuard Systems** and its authorized developers.
