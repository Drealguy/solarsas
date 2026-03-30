import type { Config } from "tailwindcss";

// NOTE: This project uses Tailwind CSS v4, which reads theme configuration
// from the @theme block in app/globals.css rather than this file.
// The `primary` color (#0061FE) is defined there via --color-primary.
// This file is kept for reference and tooling compatibility.

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0061FE",
      },
    },
  },
  plugins: [],
};

export default config;
