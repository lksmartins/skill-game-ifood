import { SitemapStream, streamToPromise } from 'sitemap'

export default async (req, res) => {
    try {
        const smStream = new SitemapStream({
            hostname: `https://${req.headers.host}`,
            cacheTime: 600000,
        })

        const links = [
            { url: '/', changefreq: 'monthly', priority: 0.5 },
            { url: '/start', changefreq: 'monthly', priority: 0.5 },
            { url: '/mapa/faco-minhas-entregas', changefreq: 'weekly', priority: 1 },
            { url: '/mapa/uso-entregas-ifood', changefreq: 'weekly', priority: 1 },
        ]

        // Create each URL row
        links.forEach(link => {
            smStream.write({
                url: link.url,
                changefreq: link.changefreq,
                priority: link.priority
            })
        })

        // End sitemap stream
        smStream.end()

        // XML sitemap string
        const sitemapOutput = (await streamToPromise(smStream)).toString()

        // Change headers
        res.writeHead(200, {
            'Content-Type': 'application/xml'
        })

        // Display output to user
        res.end(sitemapOutput)

    }
    catch (e) {
        console.log(e)
        res.send(JSON.stringify(e))
    }

}