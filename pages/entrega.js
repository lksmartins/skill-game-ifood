import React from 'react'
import styles from './start.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function entrega() {
    return (
        <main className={styles.start}>

            <div className={styles.grid}>

                <div className={styles.logo}>
                    <Image src="/ifood-logo-red.svg" width="100" height="100" objectFit="contain" />
                </div>
                <div className={styles.text}>
                    <Link href="/mapa/faco-minhas-entregas"><a>IFOOD BÁSICO<br/><small>(faço a minha própria entrega)</small></a></Link>
                    <Link href="/mapa/uso-entregas-ifood"><a>IFOOD ENTREGA<br/><small>(entrega é feita por pessoas entregadoras parceiras iFood)</small></a></Link>
                </div>

            </div>

        </main>
    )
}