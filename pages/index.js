import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Animation from '@components/QuestionSlider/Animation'

export default function Index() {

    return (
        <main className="d-flex justify-content-center align-items-center" style={{minHeight:'100vh'}}>

            <div className="container">

                <div className="row">

                    <div className="col-lg-6 col-sm-12">

                        <div className="d-flex flex-column 
                            align-items-center justify-content-center
                            align-items-lg-start
                        ">

                            <div>
                                <Image src="/ifood-logo.svg" width="150" height="150" objectFit="contain" />
                            </div>

                            <div className="d-flex flex-column gap-5 justify-content-space-evnely px-4 pb-5">
                                <h1 className="text-uppercase text-center text-lg-start">
                                    <div className="mb-3">Guia Interativo</div>
                                    Política de Cancelamento para Restaurantes
                                </h1>
                                <Link href="/start"><a className="btn-ifood-light fs-2 text-center">Iniciar minha jornada</a></Link>
                            </div>
                            
                        </div>

                    </div>
                    <div className="col-lg-6 col-sm-12 d-none d-lg-flex justify-content-center align-items-center">
                        <div style={{transform:'scale(1.3)'}}>
                            <Animation file={`/anima.json`} />
                        </div>
                    </div>

                </div>

            </div>

        </main>
    )
}