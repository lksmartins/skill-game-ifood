import React, { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function PDF({ name, email, plan, setShowCertificate }) {

    const [image, setImage] = useState('')
    const [pdf, setPdf] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    function updateImage(savePdf=false) {

        const input = document.getElementsByClassName('invoicePages')
        const pdfSize = {x: input[0].offsetWidth, y: input[0].offsetHeight}
        const pdf = new jsPDF({
            orientation: pdfSize.x > pdfSize.y ? 'l' : 'p',
            unit: 'px',
            format: [pdfSize.x, pdfSize.y],
            //hotfixes: ['px_scaling']
          })

        if( savePdf ) setIsLoading(true)

        for (let i = 0; i < input.length; i++) {

            html2canvas(input[i]).then((canvas) => {

                const imgData = canvas.toDataURL('image/jpeg')
                setImage(imgData)

                pdf.addImage(imgData, 'JPEG', 0, 0, pdfSize.x, pdfSize.y)

                if (input.length - 1 === i) {

                    setPdf( pdf.output('datauristring') )
                    if( savePdf ){
                        pdf.save('certificado_ifood.pdf')
                        setIsLoading(false)
                    }

                }
                else {
                    pdf.addPage()
                }
                

            })
        }

    }

    useEffect(() => {

        updateImage()

    }, [])

    const showResult = (success=false)=>{
        console.log('showResult', success)
        setShowSuccess(success)
        setShowError(!success)
    }

    const sendEmail = async () => {

        console.log('sendEmail')
        setIsLoading(true)

        const result = await fetch('/api/certificado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name, email,
                attachments: {image, pdf}
            })
        })

        console.log(result)
        setIsLoading(false)

        showResult(result.ok)

    }

    return (
        <div className="container px-4 py-5" style={{maxWidth:'720px'}}>

            <div className="row">
                <div className="col-6">
                    <div className="w-100 h-100 d-flex justify-content-start align-items-center">
                        <button onClick={()=>setShowCertificate(false)} class="btn-ifood-dark w-auto">
                            <i className="fa-solid fa-arrow-rotate-left me-1"></i> Voltar
                        </button>
                    </div>
                </div>
                <div className="col-6">
                    <div className="d-flex justify-content-end align-items-center">
                        <img className="img-fluid w-25" src="/ifood-logo.svg"/>
                    </div>
                </div>
            </div>

            {/* CERTIFICADO */}
            <div style={{backgroundColor: '#F1F4FD', fontSize:'clamp(1rem, 2vw, 1.5rem)', position: 'relative'}} className="invoicePages bg-light text-dark rounded text-center p-4">

                <div className="d-flex" style={{position: 'absolute', top:'1rem', left: '1rem'}}>
                    <img width="50vw" src="/ifood-logo-red.svg"/>
                </div>

                <div className="mt-4 px-4 d-flex flex-column justify-content-center align-items-center">
                    <div className="mb-3 fw-bold text-uppercase" style={{color: '#890019'}}>
                        CERTIFICADO
                    </div>
                    <div className="mb-3 fw-bold" style={{color: '#890019'}}>
                        {name}
                    </div>
                    <div className="px-3">
                        Agradecemos por ter completado a <b>Jornada da Politica de Cancelamento</b> do plano <b>{plan}</b>.
                    </div>
                    <img width="60%" src="/certificado.svg"/>
                </div>

            </div>

            {/* EXPORT */}
            <div className="row p-0 my-4">

                <div className="col-lg-12 pb-1">
                    Salvar nesse dispositivo
                </div>

                <div className="col-sm-6 col-xs-12 pe-sm-1 pb-2 pb-sm-0">
                    <a className="btn-ifood-light" download="certificado_ifood.jpeg" href={image}>
                        <i className="fa-solid me-1 fa-image"></i> Como Imagem
                    </a>
                </div>

                <div className="col-sm-6 col-xs-12 ps-sm-1">
                    <button onClick={()=>updateImage(true)} className="btn-ifood-light">
                        {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid me-1 fa-file-pdf"></i> Como PDF</>}
                    </button>
                </div>

                <div className="col-lg-12 pb-1 mt-3">
                    Enviar por email
                </div>

                <div className="col-lg-12">
                    <button onClick={sendEmail} className="btn-ifood-light">{isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid me-1 fa-file-zipper"></i> Imagem e PDF</>}</button>
                </div>
            </div>

            {/* AVISO */}
            { showSuccess || showError ? 
                <div className="">
                    {showSuccess ? 'Certificado enviado com sucesso!' : 'Houve algum erro na tentativa de enviar o seu certificado, recarregue a página e tente novamente.'}
                </div>
                : null
            }
            
        </div>
    );
}