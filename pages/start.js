import React from 'react'
import styles from './start.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function start() {
    return (
        <main className={styles.start}>

            <div className={styles.grid}>

                <div className={styles.logo}>
                    <Image src="/ifood-logo.svg" width="200" height="300" objectFit="contain" />
                </div>

                <div className={styles.text}>
                    <div className={styles.paragraph}>Olá, loja parceira! Bem-vinda ao [definir o nome que vamos dar p/ gamificação]. Nesta apresentação, você vai conseguir simular algumas situações reais envolvendo cancelamento de pedidos na plataforma iFood. O nosso objetivo é que você entenda o processo de cancelamento e como ele impacta no seu negócio. Antes de começar, aqui vão alguns pontos importantes:
                        <ul>
                            <li>Essa simulação traz alguns exemplos do que pode acontecer durante a jornada de um pedido</li>
                            <li>A qualquer momento, você poderá voltar e mudar as decisões que desejar para verificar outras possibilidades.</li>
                        </ul>
                    </div>
                    <div className={styles.image}>
                        <Image src="/bag_wbg.svg" width="250" height="250" objectFit="contain" />
                    </div>
                    <Link href="/entrega"><a>Iniciar minha jornada</a></Link>
                </div>

            </div>

        </main>
    )
}