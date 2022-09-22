import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './index.module.css'
import Animation from '@components/QuestionSlider/Animation'
import { BrowserView, MobileView } from 'react-device-detect'

export default function Index() {

    return (
        <main className={`${styles.index} container-fluid d-flex justify-content-center align-items-center p-5`}>

            <MobileView>
                <div className={`d-flex flex-column justify-content-center align-items-center`}>

                    <div className="d-flex justify-content-center align-items-center w-100">
                        <Image src="/ifood-logo.svg" width="150" height="150" objectFit="contain" />
                    </div>

                    <div className={`d-flex flex-column`}>

                        <div className={`${styles.image} ${styles.mobile}`}>
                            <Animation file={`/anima.json`} />
                        </div>

                        <div className={`${styles.text} text-center d-flex flex-column gap-5 justify-content-space-evnely`}>
                            <h1>
                                <div className="mb-3">Guia Interativo para Restaurantes</div>
                                Política de Cancelamento de Pedidos
                            </h1>
                            <Link href="/start"><a className="fs-4 mx-4">Iniciar minha jornada</a></Link>
                        </div>
                    </div>

                </div>
            </MobileView>

            <BrowserView>
                <div className={`d-flex flex-column justify-content-center align-items-center`}>

                    <div className="d-flex justify-content-flex-start w-100">
                        <Image style={{ marginLeft: `-1rem` }} src="/ifood-logo.svg" width="200" height="200" objectFit="contain" />
                    </div>

                    <div className={`d-flex`} style={{ maxWidth: `1260px` }}>

                        <div className={`${styles.text} d-flex flex-column pe-5 gap-5 justify-content-space-evnely`}>
                            <h1>
                                <div className="mb-2">Guia Interativo para Restaurantes</div>
                                Política de Cancelamento de Pedidos
                            </h1>
                            <Link href="/start"><a className="fs-2">Iniciar minha jornada</a></Link>
                        </div>

                        <div className={`${styles.image} ${styles.increase}`}>
                            <Animation file={`/anima.json`} />
                        </div>
                    </div>

                </div>
            </BrowserView>



        </main>
    )
}