import React, {useState} from 'react'
import styles from '../styles/Map.module.css'
import Modal from './Modal'
import Store from './Store'
import Button from './Button'

export default function Map(props){

    const fases = props.fases
    const currentFase = props.currentFase
    const storeItems = props.storeItems
    const user = props.user
    const wallet = props.wallet

    let fasesSolved = 0

    fases?.map((item)=>{
        if( item.solved == true ){
            fasesSolved++
        }
    })

    return(<div>

        <Button
        onClick={()=>props.changeStoreModal(true)} 
        className="btn btn-primary section-modal-btn">
            <img src="https://branching-stories.s3.amazonaws.com/btn-loja.png"/>
        </Button>

        <Modal 
            show={props.storeModal}
            onHide={()=>props.changeStoreModal(false)}
            className="modal-xl store"
            >
            <Store 
                user={user} 
                wallet={wallet} 
                changeStoreModal={props.changeStoreModal} 
                changeInventory={props.changeInventory} 
                storeItems={storeItems}
                changeStore={props.changeStoreItems}
            />

            <Button
                onClick={()=>props.changeStoreModal(false)} 
                className="btn btn-primary section-modal-btn btn-fechar">
                    <img src="https://branching-stories.s3.amazonaws.com/btn-fechar.png"/>
            </Button>
        </Modal>

    </div>)

}