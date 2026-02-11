/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "var(--color-primary)",
                "primary-dark": "color-mix(in srgb, var(--color-primary), black 20%)",
                "background-light": "#f7f6f7",
                "background-dark": "#19151d",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
}
