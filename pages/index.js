import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './index.module.css'
import { BrowserView, MobileView } from 'react-device-detect'

export default function Index() {
    return (
        <main className={styles.index}>

            <div className={styles.grid}>

                <div className={styles.logo}>
                    <Image src="/ifood-logo.svg" width="100" height="100" objectFit="contain" />
                </div>
                <div className={styles.content}>
                    <MobileView>
                        <div className={styles.image}>
                            <Image src="/sacolinha_voando.svg" width="100" height="100" objectFit="contain" />
                        </div>
                    </MobileView>

                    <div className={styles.text}>
                        <h1>
                            <div>Guia interativo</div>
                            Política de cancelamento de pedidos ifood
                        </h1>
                        <Link href="/start"><a>Iniciar minha jornada</a></Link>
                    </div>
                    <BrowserView>
                        <div className={styles.image}>
                            <Image src="/bag_wbg.svg" width="500" height="500" objectFit="contain" />
                        </div>
                    </BrowserView>
                </div>


            </div>

        </main>
    )
}