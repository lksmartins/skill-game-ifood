import React, {useState, useEffect} from 'react'
import styles from './start.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { isMobile } from 'react-device-detect'

export default function start() {

    const [deviceType, setDeviceType] = useState('desktop')

    const classes = {
        text: {mobile:'p-3', desktop:'p-5'},
        buttons: {mobile:'gap-3', desktop:'gap-5'}
    }

    useEffect(() => {
        if( isMobile ) setDeviceType('mobile')
    },[])

    return (
        <main className={`${styles.start} container-fluid d-flex flex-column align-items-center justify-content-center p-5`}>

            <div className="row align-items-center justify-content-center">
                <div className="col text-center">
                    <Link href="/">
                        <a>
                            <Image src="/ifood-logo.svg" width="200" height="150" objectFit="contain" />
                        </a>
                    </Link>
                </div>
            </div>

            <div className="row align-items-center justify-content-center w-100">
                <div className={`${styles.mainText} col fs-5 ${classes['text'][deviceType]}`}>
                    Olá, loja parceira! Bem-vinda ao [definir o nome que vamos dar p/ gamificação]. Nesta apresentação, você vai conseguir simular algumas situações reais envolvendo cancelamento de pedidos na plataforma iFood.<br />
                    O nosso objetivo é que você entenda o processo de cancelamento e como ele impacta no seu negócio. Para iniciar, selecione que tipo de plano o do seu estabelecimento:
                </div>
            </div>

            <div className={`row align-items-center justify-content-center d-flex w-100 mt-4 ${classes['buttons'][deviceType]}`}>
                <div className="col m-0 p-0">
                    <Link href="/mapa/faco-minhas-entregas">
                        <a className={styles.startButton}>
                            <div className={styles.image}>
                                <img src="/start/basico.png" />
                            </div>
                            <div className={styles.innerText}>
                                PLANO BÁSICO
                                <div className={styles.small}>Faço a minha própria entrega</div>
                            </div>

                        </a>
                    </Link>
                </div>
                <div className="col m-0 p-0">
                    <Link href="/mapa/uso-entregas-ifood">
                        <a className={styles.startButton}>
                            <div className={styles.image}>
                                <img src="/start/entrega.svg" />
                            </div>
                            <div className={styles.innerText}>
                                PLANO ENTREGA
                                <div className={styles.small}>Entrega é feita por pessoas entregadoras parceiras iFood</div>
                            </div>

                        </a>
                    </Link>
                </div>
            </div>

        </main>
    )
}