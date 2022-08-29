import React, {useEffect} from 'react'
import styles from './style/Footer.module.css'
import { useRouter } from 'next/router'
import ContactForm from '../EmailForm'
import Social from '../../lib/Social.json'
import menuItems from '../../lib/MenuItems.json'
import ihunterMenuItems from '../../lib/ihunterMenu.json'

function isIhunter(router){
    return router.asPath.includes('ihunter')
}

function ihunterFooter(){
    return(
        <div className={styles.footer} id="contato">
            
            <div className={`${styles.col} ${styles.social}`}>
                <div className={styles.title}><b>Conecte-se</b> <br/>com a gente</div>

                <div className={styles.menu}>
                    <ul>
                        {
                            ihunterMenuItems.map(item=>{
                                return <li key={item.id}><a href={item.url}>{item.name}</a></li>
                            })
                        }
                    </ul>
                </div>

                <div className={styles.social}>
                    
                    <div>
                        <a href="https://chavemestra.net/gamificacao" target="_blank"><img src="/CM-Corp-Branco.png"/></a>
                    </div>
                    <div>
                        <a href="https://i-hunter.com" target="_blank"><img src="/ihunter/logo_i-hunter_BRANCO.png"/></a>
                    </div>
                    
                </div>
            </div>

            <div className={`${styles.col} ${styles.form}`}>
                <ContactForm/>
            </div>

            <div className={`${styles.col} ${styles.bottom}`}>
                © 2022 Chave-Mestra LTDA. Todos os direitos reservados. CNPJ: 26.643.351/0001-04
            </div>
            
        </div>
    )
}

function regularFooter(){
    return(
        <div className={styles.footer} id="contato">
            
            <div className={`${styles.col} ${styles.social}`}>
                <div className={styles.title}><b>Conecte-se</b> <br/>com a gente</div>
                <a className={styles.whats} target="_blank" rel="noreferrer" href={`https://api.whatsapp.com/send?phone=${whatsNumber()}`}><i className="fab fa-whatsapp"></i> Enviar um whats</a>

                <div className={styles.menu}>
                    <ul>
                        {
                            menuItems.map(item=>{
                                return <li key={item.id}><a href={item.url}>{item.name}</a></li>
                            })
                        }
                    </ul>
                </div>

                <div className={styles.social}>
                    
                    <div>
                        <a href="https://chavemestra.net/gamificacao" target="_blank"><img src="/CM-Corp-Branco.png"/></a>
                    </div>

                    <div>
                        <a href={Social[0].url}><i className="fab fa-linkedin-in"></i></a>
                    </div>

                    <div>
                        <a href={Social[1].url}><i className="fab fa-instagram"></i></a>
                    </div>
                    
                </div>
            </div>

            <div className={`${styles.col} ${styles.form}`}>
                <ContactForm/>
            </div>

            <div className={`${styles.col} ${styles.bottom}`}>
                © 2022 Chave-Mestra LTDA. Todos os direitos reservados. CNPJ: 26.643.351/0001-04
            </div>
            
        </div>
    )
}

function whatsNumber(){
    return '555432951788'
}

export default function Footer() {

    const router = useRouter()

    if( !router.isReady ) return null

    if( router.asPath == '/ihunter-sobre' ) return null

    return isIhunter(router) ? ihunterFooter() : regularFooter()
    
}