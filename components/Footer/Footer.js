import React from 'react'
import styles from './styles/Footer.module.css'
import { useRouter } from 'next/router'

export default function Footer() {

    const router = useRouter()

    if( router.pathname == '/[hash]/fase/[faseId]'){
        return null
    }

    return (<div className={styles.footer}>

        <div className={styles.container}>
            <div className={styles.col}>
                <a target="_blank" href="https://chavemestra.net/gamificacao">
                    <img src="https://chavemestra.net/corp/logo-full-white.png"/>
                </a>
                <div className={styles.social}>
                    <a target="_blank" href="https://www.linkedin.com/company/chavemestragamificacao/">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a target="_blank" href="https://www.instagram.com/cmgamificacao/">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a target="_blank" href="https://chavemestra.net/gamificacao">
                        <i className="fas fa-globe"></i>
                    </a>
                </div>
            </div>
            <div className={styles.col}>
                <p>Esse jogo é uma ferramenta <a target="_blank" href="https://chavemestra.net/gamificacao">Chave-Mestra</a>.</p>
                <p style={{color:'white'}}>Visite nosso <a target="_blank" href="https://chavemestra.net/gamificacao">site</a> para dar um salto no desenvolvimento de equipes e processos seletivos da sua empresa.</p>
            </div>

        </div>

    </div>)
}