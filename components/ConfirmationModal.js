import React, { useState, useEffect } from 'react'
import Modal from '@components/Modal'

export default function ConfirmationModal(props) {

    const { show, setShow, action, actionParams } = props
    const seconds = 10
    const [timer, setTimer] = useState(seconds)

    const timerButton = () => {
        if (timer > 0) return
        action()
        setShow(false)
    }

    const footer = <div className="w-100 d-flex justify-content-between align-items-center gap-3">
        <button type="button" className="btn-ifood-light w-auto" onClick={props.onHide}><i className="fa-solid me-2 fa-xmark"></i> Fechar</button>
        <button type="button" disabled={timer>0} className="btn-ifood gold w-auto" onClick={() => timerButton()}><i className="fa-solid me-2 fa-file-pdf"></i> Gerar Certificado{timer>0&&` (${timer})`}</button>
    </div>

    useEffect(() => {
        setTimer(seconds)
    }, [show])

    useEffect(() => {

        if (timer == 0) return

        const interval = setInterval(() => {

            setTimer(prev => prev - 1)

        }, 1000)

        return () => clearInterval(interval)

    }, [timer])

    return <Modal 
        show={show}
        onHide={()=>setShow(false)}
        title="Confirmação"
        footer={footer}
        >
        {props.children}
    </Modal>
}