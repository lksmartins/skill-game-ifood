const { SitemapStream, streamToPromise } = require('sitemap')
const { Readable } = require('stream')

// An array with your links
const links = [
    { url: '/', changefreq: 'monthly', priority: 0.5 },
    { url: '/start', changefreq: 'monthly', priority: 0.5 },
    { url: '/mapa/faco-minhas-entregas', changefreq: 'weekly', priority: 1 },
    { url: '/mapa/uso-entregas-ifood', changefreq: 'weekly', priority: 1 },
]

// Create a stream to write to
const stream = new SitemapStream({ hostname: 'https://skill-game-ifood.vercel.app/' })

// Return a promise that resolves with your XML string
return streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    data.toString()
)