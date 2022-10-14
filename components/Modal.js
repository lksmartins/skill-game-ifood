import React from 'react'
import { Modal } from 'react-bootstrap'

export default function myModal(props){

    const hasFooter = 'hasfooter' in props && props?.hasfooter == 'false' ? false : true
    
    const header = props.title ? (<Modal.Header>
        <Modal.Title style={{marginLeft:'0.75rem'}}>
            {props.title}
        </Modal.Title>
    </Modal.Header>) : null

    return (
        <Modal
            {...props}
            centered
            className="progressModal"
        >
            {header}
            <Modal.Body className="pt-0">
                {props.children}
            </Modal.Body>
            {hasFooter &&
            <Modal.Footer>
                { props.footer ? props.footer : <button className="btn-ifood" onClick={props.onHide}>Fechar</button> }
            </Modal.Footer>
            }
        </Modal>
    )

}