require('dotenv').config()

const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')

const env = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    API_KEY: process.env.API_KEY,
    API_URL: process.env.API_URL,
    API_TOKEN: process.env.API_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
    ENV: process.env.ENV,
    RECAPTCHA_KEY: process.env.RECAPTCHA_KEY,
  }
}

const rewriteRules = [
  {
    source: '/ihunter/:hash/fases',
    destination: '/:hash/fases'
  },
  {
    source: '/ihunter/:hash/pre-missao',
    destination: '/:hash/pre-missao'
  },
  {
    source: '/ihunter/:hash',
    destination: '/:hash'
  },
  {
    source: '/ihunter/user/:userHash/report',
    destination: '/ihunter/user/:userHash/report'
  },
]

const redirectRules = [
  {
    source: '/signout',
    destination: '/',
    permanent: true
  }
]

module.exports = withPlugins(

  [[withImages],[env]], 

  {
    images: {
      domains: ['branching-stories.s3.amazonaws.com']
    },
    async rewrites() {
      return rewriteRules;
    },
    async redirects() {
      return redirectRules;
    },
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: 'empty'
        }
      }
      return config
    }
  }
)