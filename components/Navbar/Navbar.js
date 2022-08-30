import React, { useState, useEffect } from 'react'
import styles from './style/Navbar.module.css'
import { useRouter } from 'next/router'
import AudioPlayer from '../AudioPlayer'
import menuItems from '../../lib/MenuItems.json'

export function isInGameRoute(){
    
    const router = useRouter()
    const route = router.route

    if( route.includes('/[hash]') && !route.includes('/report') ){
        return true
    }
    else{
        return false
    }

}

export default function Navbar(){

    const router = useRouter()

    const isInGame = isInGameRoute()

    const { hash } = router.query
    const user = {}
    const [navShow, setNavShow] = useState(false)

    const [showResetPlayer, setShowResetPlayer] = useState(false)
    const resetBtnDefaultText = 'Reset Player'
    const [ resetBtnText, setResetBtnText ] = useState(resetBtnDefaultText)

    // Reset player
    useEffect(() => {
        //console.log(window.location.hostname) // logs: localhost
        //console.log(window.location.href)     // logs: http://localhost:3000/

        const hostname = window.location.hostname

        // only show resetPlayer with these domains
        if( hostname == 'localhost' || hostname.includes('.vercel.app') ){
            setShowResetPlayer(true)
        }

    }, [])
    

    async function resetPlayer(data){

        return

        setResetBtnText(<i className="fas fa-spin fa-spinner"></i>)

        await fetch( process.env.API_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                token: process.env.API_KEY, 
                action: 'resetPlayer',
                user: data
            })
        })

        setResetBtnText(resetBtnDefaultText)

        router.push(`/${hash}/fases`)

    }

    const resetPlayerBtn = showResetPlayer ? 
    <li>
        <button className="btn btn-light" onClick={() => resetPlayer(user?.id)}>{resetBtnText}</button>
    </li> : null

    const userButton = ''

    const inGameMenu = <>
        <li>
            <AudioPlayer/>
        </li>
        {userButton}
    </>

    const offGameMenu = menuItems.map(item=>{
        return <li key={item.id}><a href={item.url}>{item.name}</a></li>
    })
    

    return(<div>

        <nav className={styles.navbar}>
            <div className={styles.navItems}>
                <div className={styles.logoWrapper}>
                    <a href="/"><img src="/SKILL-GAME-DEITADO.png"/></a>
                </div>
                <div className={styles.menuIcon} onClick={() => setNavShow(!navShow)}>
                    <i aria-hidden className={navShow ? 'fas fa-times' : 'fas fa-bars'} />
                </div>
                <ul className={navShow ? styles.navMenu +' '+ styles.navMenuActive : styles.navMenu}>

                    { isInGame ? inGameMenu : offGameMenu }
                    
                </ul>
            </div>
        </nav>

    </div>)

}