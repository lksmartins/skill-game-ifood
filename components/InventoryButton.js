import React, {useState} from 'react'
import Modal from './Modal'
import Inventory from './Inventory'
import Button from './Button'

export default function Map(props){

    const items = props.items
    const user = props.user

    const [showModal, setShowModal] = useState(false)

    return(<div>

        <Button
        onClick={()=>setShowModal(true)} 
        className="btn btn-primary section-modal-btn">
            <img src="https://branching-stories.s3.amazonaws.com/btn-inventario.png"/>
        </Button>

        <Modal 
            show={showModal}
            onHide={()=>setShowModal(false)}
            className="modal-xl smaller inventory"
            >
            <Inventory user={user} items={items} />
            
            <Button
            onClick={()=>setShowModal(false)} 
            className="btn btn-primary section-modal-btn btn-fechar">
                <img src="https://branching-stories.s3.amazonaws.com/btn-fechar.png"/>
            </Button>
        </Modal>

    </div>)

}