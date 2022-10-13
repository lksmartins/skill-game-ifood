import React, { useState, useRef } from 'react'
import Form from '@components/Forms/Form'
import { findValueById } from '@lib/helper'
import CertificateComponent from '@components/Certificate'
import { getToken } from '@lib/helper'

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

    const [showCertificate, setShowCertificate] = useState(false)
    const checkRef = useRef()

    const fields = [
        { id: 'name', name: 'Seu nome completo', type: 'text', value: '' },
        { id: 'email', name: 'Seu e-mail', type: 'email', value: '' },
        { id: 'newsletter', ref: checkRef, name: 'Permito que o Ifood use meu email para enviar ofertas e novidades', type: 'checkbox', value: '' },
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

    if (showCertificate) {
        return <CertificateComponent 
                    name={name} 
                    email={email} 
                    plan={map == 'F001' ? 'Básico' : 'Entrega'}
                    setShowCertificate={setShowCertificate}
                />
    }

    return (
        <div style={{ minHeight: '100vh' }} className="container d-flex flex-fill flex-column justify-content-center align-items-center">
            <div>
                <img src="/ifood-logo.svg" />
            </div>
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
                    successMessage="Certificado gerado com sucesso. O certidicado foi enviado para o seu email."
                    onSuccess={(response) => {
                        console.log(response)
                        setName(response[0].value)
                        setEmail(response[1].value)

                        if (checkRef.current.checked) saveEmail(response[1].value)

                        setShowCertificate(true)
                    }}

                    footerLeftEl={<button onClick={()=>history.back()} class="btn-ifood-dark"><i className="fa-solid fa-arrow-rotate-left me-1"></i> Voltar</button>}
                    buttonText="Gerar Certificado"
                />
            </div>

        </div>
    )

}