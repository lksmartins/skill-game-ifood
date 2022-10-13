import React, { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Link from 'next/link'

 // http://raw.githack.com/MrRio/jsPDF/master/docs/index.html

export default function PDF({ name, email, plan, setShowCertificate }) {

    const [image, setImage] = useState('')
    const [pdf, setPdf] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // planning to expand pdf when saving with a loading overlay
    const [canvasOptions, setCanvasOptions] = useState({
        width: '100vh',
        maxWidth: '720px'
    })

    const resetAlerts = ()=>{
        setShowSuccess(false)
        setShowError(false)
    }

    function updateImage(savePdf=false, callback=null) {

        resetAlerts()

        if( savePdf ) setIsLoading(true)

        const input = document.getElementsByClassName('invoicePages')
        const pdfSize = {x: input[0].offsetWidth, y: input[0].offsetHeight}
        const pdf = new jsPDF({
            orientation: pdfSize.x > pdfSize.y ? 'l' : 'p',
            unit: 'px',
            format: [pdfSize.x, pdfSize.y],
            hotfixes: ['px_scaling']
        })

        console.log('Y', pdfSize.y)

        for (let i = 0; i < input.length; i++) {

            html2canvas(input[i]).then((canvas) => {

                const imgData = canvas.toDataURL('image/jpeg')
                setImage(imgData)

                pdf.addImage(imgData, 'JPEG', 0, 0, pdfSize.x, pdfSize.y)

                if (input.length - 1 === i) {

                    // STATE
                    setPdf( pdf.output('datauristring') )

                    if( savePdf ){
                        pdf.save('certificado_ifood.pdf')
                        setIsLoading(false)
                    }

                    if( callback ) callback()

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

        updateImage(false, async()=>{

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

        })

    }

    return (
        <div className="container px-4 pt-3 pb-5" style={{
            maxWidth:canvasOptions.maxWidth
        }}>

            {/* BACK BUTTON AND LOGO */}
            <div className="row mb-3">
                <div className="col-6">
                    <div className="w-100 h-100 d-flex justify-content-start align-items-center">
                        <button onClick={()=>setShowCertificate(false)} className="btn-ifood-dark w-auto">
                            <i className="fa-solid fa-arrow-rotate-left me-1"></i> Voltar
                        </button>
                    </div>
                </div>
                <div className="col-6">
                    <div className="d-flex justify-content-end align-items-center">
                        <Link href="/">
                            <img className="img-fluid" style={{width: 'clamp(50px, 20vw, 100px)', height: 'auto', cursor:'pointer'}} src="/ifood-logo.svg"/>
                        </Link>
                    </div>
                </div>
            </div>

            {/* CERTIFICADO */}
            <div className="invoicePages text-dark text-center p-4"
            style={{backgroundColor: '#890019', fontSize:'clamp(100%, 1.3rem, 2rem)', position: 'relative'}} >

                <div className="container-fluid bg-light position-relative rounded py-4">
                    <div className="d-flex" style={{position: 'absolute', top:'1rem', left: '1rem'}}>
                        <img style={{width: 'clamp(10px, 12vw, 60px)', height: 'auto'}} src="/ifood-logo-red.svg"/>
                    </div>

                    <div className="px-1 px-lg-4 pb-2 d-flex flex-column justify-content-center align-items-center">
                        <div className="mb-3 mt-5 fw-bold text-uppercase" style={{color: '#890019'}}>
                            CERTIFICADO
                        </div>
                        <div className="mb-1 mb-lg-3 fw-bold" style={{color: '#890019'}}>
                            {name}
                        </div>
                        <div className="px-3">
                            Parabéns por ter completado a <br/><b>Jornada da Politica de Cancelamento</b><br/> do <b>plano {plan}</b>.
                        </div>
                        <img width="60%" style={{maxWidth:'250px'}} src="/certificado.svg"/>
                    </div>
                </div>

            </div>

            {/* EXPORT */}
            <div className="row mx-0 my-4 bg-light p-5 text-dark rounded">

                <div className="col-lg-12 pb-1">
                    Salvar nesse dispositivo
                </div>

                <div className="col-sm-6 col-xs-12 pe-sm-1 pb-2 pb-sm-0">
                    <a className="btn-ifood gold" download="certificado_ifood.jpeg" href={image}>
                        <i className="fa-solid me-1 fa-image"></i> Como Imagem
                    </a>
                </div>

                <div className="col-sm-6 col-xs-12 ps-sm-1">
                    <button onClick={()=>updateImage(true)} className="btn-ifood gold">
                        {isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid me-1 fa-file-pdf"></i> Como PDF</>}
                    </button>
                </div>

                <div className="col-lg-12 pb-1 mt-3">
                    Enviar por email
                </div>

                <div className="col-lg-12">
                    <button onClick={sendEmail} className="btn-ifood gold">{isLoading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid me-1 fa-file-zipper"></i> Imagem e PDF</>}</button>
                </div>

                {/* AVISO */}
                <div className="col mt-2">
                    { showSuccess && <div className="alert alert-success" role="alert">
                            Certificado enviado com sucesso!
                        </div>
                    }
                    { showError && <div className="alert alert-danger" role="alert">
                            Houve algum erro na tentativa de enviar o seu certificado, recarregue a página e tente novamente.
                        </div>
                    }
                </div>
            </div>
            
        </div>
    );
}