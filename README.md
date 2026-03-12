````markdown
# Svelte Project

This project is built with **Svelte** using the official CLI tool **sv**. It provides a minimal setup with formatting and linting tools to maintain clean and consistent code.

## Getting Started

### Create a New Project

```bash
npx sv create my-app
````

### Recreate This Project

To recreate this project with the same configuration:

```bash
npx sv@0.12.5 create --template minimal --no-types --add prettier eslint --install npm .
```

This setup includes:

* Prettier for code formatting
* ESLint for linting
* npm as the package manager

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Start the server and open the app automatically in the browser:

```bash
npm run dev -- --open
```

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

To deploy the application, you may need to install an adapter depending on your hosting platform (Node, Vercel, Netlify, Static hosting, etc.).

See the official documentation for more details:
[https://svelte.dev/docs/kit/adapters](https://svelte.dev/docs/kit/adapters)

## Tools

* Svelte
* sv CLI
* Prettier
* ESLint
* npm

```
```
