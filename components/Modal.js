import React from 'react'
import { Modal } from 'react-bootstrap'

export default function myModal(props){

    const hasFooter = 'hasfooter' in props && props?.hasfooter == 'false' ? false : true
    
    const header = props.title ? (<Modal.Header>
        <Modal.Title>
            {props.title}
        </Modal.Title>
    </Modal.Header>) : null

    return (
        <Modal
            {...props}
            centered
            className={props.className ? props.className : 'modal'}
        >
            {header}
            <Modal.Body>
                {props.children}
            </Modal.Body>
            {hasFooter &&
            <Modal.Footer>
                { props.footer ? props.footer : <button className="btn btn-primary" onClick={props.onHide}>Fechar</button> }
            </Modal.Footer>
            }
        </Modal>
    )

}