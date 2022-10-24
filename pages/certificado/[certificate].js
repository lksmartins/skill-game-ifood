import React, { useState, useRef, useEffect } from 'react'
import Form from '@components/Forms/Form'
import { findValueById } from '@lib/helper'
import CertificateComponent from '@components/Certificate'
import { getToken } from '@lib/helper'
import Link from 'next/link'
import Modal from '@components/ConfirmationModal'
import {useLocalStorage} from '@hooks/useLocalStorage'
import { useRouter } from 'next/router'

export async function getStaticPaths() {
    return {
        paths: [
            '/certificado/faco-minhas-entregas',
            '/certificado/uso-entregas-ifood'
        ],
        fallback: false, // can also be true or 'blocking'
    }
}

export async function getStaticProps(context) {

    const map = context.params.certificate
    const flowRef = map == 'faco-minhas-entregas' ? 'F001' : 'F002'

    return {
        props: {
            map: flowRef
        }
    }

}

export default function Certificate({ map }) {

    const router = useRouter()
    const [showCertificate, setShowCertificate] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const lsMapStr = `map_${map}`
    const [localMap, setLocalMap, resetLocal] = useLocalStorage(lsMapStr)
    const checkRef = useRef()

    const fields = [
        { id: 'name', name: 'Seu nome completo', type: 'text', value: '' },
        { id: 'email', name: 'Seu e-mail', type: 'email', value: '' },
        { id: 'newsletter', ref: checkRef, name: 'Permito que o Ifood use meu email para enviar comunicações sobre o tema cancelamento', type: 'checkbox', value: '' },
    ]

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const saveEmail = async (email) => {

        const token = await getToken()

        fetch(`${process.env.API_URL}/newsletter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
            },
            body: JSON.stringify({ email })
        })
    }

    useEffect(() => {

        if( (localMap == '' || localMap == null) && showCertificate==false ){
            //redirect user to /index
            router.push('/')
        }

    },[])

    if (showCertificate) {
        return <CertificateComponent
            name={name}
            email={email}
            plan={map == 'F001' ? 'básico' : 'entrega'}
            setShowCertificate={setShowCertificate}
        />
    }

    return (
        <div style={{ minHeight: '100vh', maxWidth:'720px' }} className="container d-flex flex-fill flex-column justify-content-center align-items-center">
            
            <Modal
                show={showConfirmationModal}
                setShow={setShowConfirmationModal}
                onHide={()=>{
                    setShowConfirmationModal(false)

                }}
                action={()=>{
                    //show certificate
                    setShowCertificate(true)

                    // delete flow local storage
                    resetLocal(lsMapStr)
                }}
            >
                <div className="container-fluid">
                    <div className="col">
                        <div className="alert alert-danger mb-3" role="alert">
                            Por favor, verifique se seus dados estão corretos.<br/>
                            Para gerar o certificado novamente será necessário refazer a jornada.
                        </div>
                    </div>

                    <div className="col">
                        Seu nome: 
                    </div>
                    <div className="col mb-2">
                        {name}
                    </div>

                    <div className="col">
                        Seu email: 
                    </div>
                    <div className="col">
                        {email}
                    </div>
                </div>
            </Modal>

            <div>
                <Link href="/"><a><img src="/ifood-logo.svg" /></a></Link>
            </div>

            <div className="container bg-light text-dark rounded py-4 mb-5">

                <div>
                    <Form
                        fields={fields}
                        apiBody={(state) => {
                            return {
                                mapId: map,
                                name: findValueById(state, 'name'),
                                email: findValueById(state, 'email'),
                            }
                        }
                        }
                        errorMessage="Houve um erro na tentativa de gerar seu certificado. Recarregue a página e tente novamente."
                        successMessage="Certificado gerado com sucesso. O certificado foi enviado para o seu email."
                        onSuccess={(response) => {
                            console.log(response)
                            setName(response[0].value)
                            setEmail(response[1].value)

                            if (checkRef.current.checked) saveEmail(response[1].value)

                            //setShowCertificate(true)

                            setShowConfirmationModal(true)
                        }}

                        footerLeftEl={<button onClick={() => history.back()} className="btn-ifood-light"><i className="fa-solid fa-arrow-rotate-left me-1"></i> Voltar</button>}
                        buttonText="Gerar Certificado"
                    />
                </div>

            </div>


        </div>
    )

}