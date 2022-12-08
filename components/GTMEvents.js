import {useEffect} from 'react'
import {useRouter} from 'next/router'

//const trackerId = process.env.GOOGLE_GLOBAL_TAG
const trackerId = 'G-HSK3TGXYZ6'

export default function GTMEvents() {

    const router = useRouter()

    /* useEffect(()=>{
        WhatsCorp()
        WhatsGramado()
    },[]) */

    const handleRouteChange = (url) => {
        window.gtag('config', trackerId, {
          page_path: url,
        })
    }

    useEffect(() => {
        router.events.on('routeChangeComplete', handleRouteChange)
        return () => {
          router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [router.events])

    return null
}

function buttonClick(condition, callback){

    const buttons = document.querySelectorAll('a')

    buttons.forEach(item=>{

        if(!item.hasAttribute('href')) return null

        if( condition(item) ){
            item.addEventListener('click',()=>{
                callback()
            })
        }
        
    })

}

function WhatsGramado(){

    const condition = (item)=>{
        return item.getAttribute('href') == 'https://api.whatsapp.com/send?phone=555192337112' || item.getAttribute('href') == 'https://api.whatsapp.com/send?phone=5551992337112'
    }
    const callback = ()=>{ 
        window.gtag('event', 'conversion', {'send_to': `${trackerId}/DZyJCPjcgr4DEK-0maQD`})
    }

    buttonClick( condition, callback )

}

function WhatsCorp(){

    const condition = (item)=>{
        console.log('WHATS CORP', item.getAttribute('href'))
        return item.getAttribute('href') == 'https://api.whatsapp.com/send?phone=555432951788'
    }
    const callback = ()=>{
        window.gtag('event', 'conversion', {'send_to': `${process.env.GOOGLE_GLOBAL_TAG}/nWKOCNrJkLoDEK-0maQD`})
    }

    buttonClick( condition, callback )

}