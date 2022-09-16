import React from 'react'
import styles from './start.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function entrega() {
    return (
        <main className={styles.start}>

            <div className={styles.grid}>

                <div className={styles.logo}>
                    <Image src="/ifood-logo.svg" width="200" height="200" objectFit="contain" />
                </div>
                <div className={styles.text}>
                    <div className={styles.image}>
                        <Image src="/bag_wbg.svg" width="250" height="250" objectFit="contain" />
                    </div>
                    <Link href="/mapa/faco-minhas-entregas"><a>IFOOD BÁSICO<div className={styles.small}>faço a minha própria entrega</div></a></Link>
                    <Link href="/mapa/uso-entregas-ifood"><a>IFOOD ENTREGA<div className={styles.small}>entrega é feita por pessoas entregadoras parceiras iFood</div></a></Link>
                </div>

            </div>

        </main>
    )
}