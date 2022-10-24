import React from 'react'
import styles from './start.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function start() {

    return (
        <main className={`${styles.start} container-fluid d-flex flex-column align-items-center justify-content-center p-5`}>

            <div className="container">
                <div className="row">
                    <div className="col text-center">
                        <Link href="/">
                            <a><Image src="/ifood-logo.svg" width="200" height="150" objectFit="contain" /></a>
                        </Link>
                    </div>
                </div>

                <div className="row">
                    <div className="col fs-5 rounded p-5 mb-4" style={{backgroundColor:'#F9F2E8', color:'#5C5C5C'}}>
                        Olá, loja parceira! Bem-vinda ao Guia Interativo - Política de Cancelamento para Restaurantes. Aqui, você vai simular situações reais envolvendo cancelamentos que ocorrem na jornada de pedidos na plataforma iFood.<br/>
                        O nosso objetivo é que você entenda o processo de cancelamento e como ele impacta no seu negócio. Para iniciar, selecione que tipo de plano o do seu estabelecimento:
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 col-sm-12 p-0 pe-lg-2 mb-4">
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
                    <div className="col-lg-6 col-sm-12 p-0 ps-lg-2">
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

            </div>

        </main>
    )
}