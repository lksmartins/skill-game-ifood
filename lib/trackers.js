import Script from 'next/script'

export default function trackers() {
    return <>
        {GoogleAnalytics()}
    </>
}

const scriptStrategy = 'afterInteractive'

function GoogleAnalytics(){

    //const gID = process.env.GOOGLE_GLOBAL_TAG
    // gtag('config', 'UA-49860358-2')
    //const gID = 'G-HSK3TGXYZ6'
    const gID = 'G-Y95HE6QKFQ'

    return <>
        {/* <Script
            strategy={scriptStrategy}
            src={`https://www.googletagmanager.com/gtag/js?id=${gID}`}
        />
        <Script id="google-analytics" strategy={scriptStrategy}>
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gID}');
            `}
        </Script> */}

        <Script 
        strategy="lazyOnload" 
        src={`https://www.googletagmanager.com/gtag/js?id=${gID}`} />

        <Script strategy="lazyOnload">
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gID}', {
                page_path: window.location.pathname,
                });
            `}
        </Script>
    </>
}

function Facebook(){

    return <>
        <Script id="facebook" strategy={scriptStrategy}>
            {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '${process.env.FACEBOOK_ID}');
            fbq('track', 'PageView');
            `}
        </Script>
    </>
}