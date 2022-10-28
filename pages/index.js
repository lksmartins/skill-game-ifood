import React from 'react'
import styles from './start.module.css'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

export default function start() {

    return (<>

        <Head>
            <title>Escolha seu plano</title>
        </Head>

        <main className={`${styles.start} container-fluid d-flex flex-column align-items-center justify-content-center`}>

            <div className="container m-0 p-2">
                <div className="row">
                    <div className="col text-center">
                        <Link href="/">
                            <a><Image src="/ifood-logo.svg" width="200" height="100" objectFit="contain" /></a>
                        </Link>
                    </div>
                </div>

                <div className="row">
                    <div className={`col fs-5 rounded p-4 mb-4 ${styles.mainText}`}>
                        Olá parceiro! Escolha abaixo seu plano e veja situações que podem acontecer durante a jornada do pedido:
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 col-sm-12 p-0 pe-lg-2 mb-4">
                        <Link href="/mapa/faco-minhas-entregas">
                            <a className={`${styles.startButton} btn-ifood-light`}>
                                <div className={`${styles.image} d-none d-md-block`}>
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
                            <a className={`${styles.startButton} btn-ifood-light`}>
                                <div className={`${styles.image} d-none d-md-block`}>
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
    </>)
}