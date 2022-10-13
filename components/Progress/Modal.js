import React from 'react'
import { Modal } from 'react-bootstrap'
import Link from 'next/link'

export default function ProgressModal(props){

    const { map } = props
    const mapUri = map == 'F001' ? 'faco-minhas-entregas' : 'uso-entregas-ifood'

    return (
        <Modal {...props} centered className="progressModal">
            <Modal.Title>
                <div className="p-3">
                    Parabéns!
                </div>
            </Modal.Title>
            <Modal.Body>
                Voce atingiu 100% em progresso nessa jornada.<br/>
                Agora você pode gerar um certificado para mostrar para todo mundo quem é o mestre da jornada de cancelamento de pedidos do ifood.
            </Modal.Body>
            <Modal.Footer>
                <div className="w-100 d-flex justify-content-between">
                    <button className="btn-ifood-light w-auto" onClick={props.onHide}><i className="fa-solid me-2 fa-xmark"></i> Fechar</button>
                    <Link href={`/certificado/${mapUri}`}><a className="btn-ifood gold w-auto"><i className="fa-solid me-2 fa-file-pdf"></i> Gerar Certicado</a></Link>
                </div>
            </Modal.Footer>
        </Modal>
    )

}