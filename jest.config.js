module.exports = {
    preset: "jest-puppeteer",
    globals: {
        URL: "https://localhost:3000"
    },
    testMatch: [
        "**/__tests__/**/*.test.js"
    ],
    verbose: true
}