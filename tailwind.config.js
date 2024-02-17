/** @type {import('tailwindcss').Config} */
const {join} = require("path");
module.exports = {
    plugins: [
        require('flowbite/plugin')
    ],
    content: [join(__dirname, './index.html'), join(__dirname, './src/**/*.{html,js,tsx}')],
    // content: [
    //     "./src/**/*.{js,jsx,ts,tsx}",
    //     // 'node_modules/flowbite-react/lib/esm/**/*.js'
    //     // "./node_modules/flowbite/lib/esm/component/**/*.{js,jsx,ts,tsx}"
    // ],
    theme: {
        container: {
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
        },
        extend: {
            colors: {
                gray: "#1e212a",
                darkslategray: {
                    "100": "#40444e",
                    "200": "#282c35",
                    "300": "rgba(40, 44, 53, 0.9)",
                },
                lightslategray: {
                    "100": "#8f95a3",
                    "200": "#7e8594",
                },
                silver: "#c3c3c5",
                palevioletred: {
                    "100": "#ec87c0",
                    "200": "#e882bc",
                },
                black: "#000",
                mediumpurple: {
                    "100": "#ac92eb",
                    "200": "#aa90eb",
                },
                white: "#fff",
                dimgray: {
                    "100": "#616164",
                    "200": "#555",
                    "300": "#4d4d4d",
                },
                lightgray: "#ccc",
                whitesmoke: "#eee",
                yellowgreen: "#95d03a",
                deepskyblue: "#00aff0",
                steelblue: "#0088cc",
                mediumspringgreen: "#25d366",
                orangered: "#ff4500",
                dodgerblue: "#448aff",
                cornflowerblue: "#4267b2",
                hotpink: "#c55295",
            },
            spacing: {},
            fontFamily: {
                sans: [
                    '"Inter"',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    '"Noto Sans"',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                    '"Noto Color Emoji"',
                ],
            },
            borderRadius: {
                "8xs": "5px",
                "3xs": "10px",
                mini: "15px",
                xl: "20px",
                "10xs": "3px",
                "11xl": "30px",
                "3xl": "22px",
            },
        },
        fontSize: {
            mini: "15px",
            smi: "13px",
            "3xl": "22px",
            lgi: "19px",
            lg: "18px",
            "21xl": "40px",
            "5xl": "24px",
            "13xl": "32px",
            "xs-8": "11.8px",
            base: "16px",
            inherit: "inherit",
        },
    }
}
