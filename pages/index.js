import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './index.module.css'
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect'

export default function Index() {
    return (
        <main className={styles.index}>

            <div className={styles.grid}>

                <div className={styles.logo}>
                    <Image src="/ifood-logo.svg" width="100" height="100" objectFit="contain" />
                </div>
                <MobileView>
                    <div className={styles.image}>
                        <Image src="/sacolinha_voando.svg" width="100" height="100" objectFit="contain" />
                    </div>
                </MobileView>
                <div className={styles.text}>
                    <h1>Guia interativo de política de cancelamento da ifood</h1>
                    <Link href="/start"><a>Iniciar</a></Link>
                </div>
                <BrowserView>
                    <div className={styles.image}>
                        <Image src="/ifood-logo.svg" width="100" height="100" objectFit="contain" />
                    </div>
                </BrowserView>


            </div>

        </main>
    )
}