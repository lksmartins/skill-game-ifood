import React, {useState} from 'react'
import Modal from './Modal'
import Button from './Button'

export default function Help(props){

    const [showModal, setShowModal] = useState(false)

    return(<div>

        <Button
        onClick={()=>setShowModal(true)} 
        className="btn btn-primary section-modal-btn">
            <img src="https://branching-stories.s3.amazonaws.com/btn-ajuda.png"/>
        </Button>

        <Modal 
            show={showModal}
            onHide={()=>setShowModal(false)}
            className="modal-xl smaller"
            >
                
            <p>Help text</p>

            <Button
            onClick={()=>setShowModal(false)} 
            className="btn btn-primary section-modal-btn btn-fechar">
                <img src="https://branching-stories.s3.amazonaws.com/btn-fechar.png"/>
            </Button>
        </Modal>

    </div>)

}