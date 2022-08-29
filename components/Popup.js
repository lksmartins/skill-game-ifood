import React, {useState} from 'react'
import Modal from './Modal'
import TimerButton from './TimerButton'
import HtmlParser from 'react-html-parser'
import {useRouter} from 'next/router'

export default function Popup(props){

    const router = useRouter()
    const [showModal, setShowModal] = useState(false)

    const toggleModal = props.toggle ? props.toggle : showModal
    const setToggleModal = props.setToggle ? props.setToggle : ()=>setToggleModal()
    const btnText = props.btnText ? props.btnText : 'Continuar'

    const content = props.content ? props.content : ''
    const action = props.action ? props.action : null
    const param = props.param ? props.param : null

    let actionFunc = null

    if( action == 'close' ){
        actionFunc = () => setToggleModal(false)
    }

    if( action == 'router' ){
        actionFunc = () => router.push(param)
    }

    return(<div>

        <Modal 
            show={toggleModal}
            onHide={()=>{}}
            className="popup"
            footer={
                <TimerButton onClick={actionFunc} start={true} time={3}>{btnText}</TimerButton>
            }
            title="Desfecho da Escolha"
            >
            <div className="content">
                <div className="img">
                    <img src={props.img}/>
                </div>
                <p>{HtmlParser(content)}</p>
            </div>

        </Modal>

    </div>)

}