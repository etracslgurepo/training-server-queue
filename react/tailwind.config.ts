import fluid, { extract, fontSize, screens } from "fluid-tailwind";
import type { Config } from "tailwindcss";

const config: Config = {
  content: {
    files: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    extract,
  },
  theme: {
    screens,
    fontSize,
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [fluid],
};
export default config;
