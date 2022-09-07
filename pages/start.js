import React from 'react'
import styles from './start.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function start() {
    return (
        <main className={styles.start}>

            <div className={styles.grid}>

                <div className={styles.logo}>
                    <Image src="/ifood-logo-red.svg" width="100" height="100" objectFit="contain" />
                </div>
                <div className={styles.text}>
                    <p>Olá, bem-vindo ao guia interativo de política de cancelamento da iFood. Você irá interagir com uma apresentação gamificada, onde você irá escolher sua jornada de acordo com uma situação que ocorre ou que está ocorrendo em seu estabelecimento. Como este guia é interativo, a qualquer momento você poderá voltar e rever quantas situações desejar. Esperamos que este guia lhe ajude no seu processo de tomada de decisão e de melhor instruí-lo sobre o que fazer em situações de cancelamento.</p>
                    <Link href="/play"><a>Iniciar minha jornada</a></Link>
                </div>

            </div>

        </main>
    )
}