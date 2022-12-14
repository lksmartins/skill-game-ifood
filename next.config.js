/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    API_KEY: process.env.API_KEY,
    API_URL: process.env.API_URL,
    API_TOKEN: process.env.API_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
    ENV: process.env.ENV,
    RECAPTCHA_KEY: process.env.RECAPTCHA_KEY,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  },

  plugins: [
    ["@babel/plugin-proposal-object-rest-spread"]
  ],
}

module.exports = nextConfig