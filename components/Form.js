import React, { useState } from 'react'
import Modal from './Modal'
import TimerButton from './TimerButton'
import { useRouter } from 'next/router'

export default function Form(props) {

    const router = useRouter()
    const defaultButtonText = ()=>{return(<><i className="fas fa-paper-plane"/> Enviar</>)}
    const loadingButtonText = <i className="fas fa-spin fa-spinner"/>

    const refObject = props.refObject ? props.refObject : {[props.id]:""}

    const [stateValue, setValue] = useState(refObject)
    const [modalShow, setModalShow] = useState(false)
    const [showMessage, setShowMessage] = useState('')
    const [buttonText, setButtonText] = useState(defaultButtonText)
    const [buttonClass, setButtonClass] = useState("btn btn-primary")
    const [buttonDisabled, setButtonDisabled] = useState("")

    function handleInputChange(e) {

        const target = e.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
    
        setValue({[name]: value})
    }

    async function handleSubmit(e) {

        console.log('form submit')

        e.preventDefault()

        // load button
        setButtonText(loadingButtonText)

        const hash = props.hash
        const user = props.user
        const formObj = props.values
        const myRef = props.myref ? props.myref : e.target[0].attributes.myref.value

        console.log(hash, user, formObj)
        
        const res = await fetch(process.env.API_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                token: process.env.API_KEY, 
                action: props.api_action ? props.api_action : 'answerForm',
                hash: hash,
                user: user, // user email
                form: formObj
            })
        })

        const response = await res.json()

        console.log(res.status, response)

        if( props.customValidation ){
            if( props.customValidation() == false ){
                setButtonText(defaultButtonText)
                return false
            }
        }

        // modal
        if( props.modalSet && response.status === 200 ){
            props.modalSet ? props.modalSet(true) : setModalShow(true)
            props.modalMessage ? props.modalMessage(response.unit) : null
            props.inputBack ? props.inputBack(code) : null
            props.callback ? props.callback(myRef) : null
            props.response ? props.response(response.message) : null
            
            if( props.change_btn && props.change_btn == true ){
                setButtonText("Solucionado")
                setButtonClass("button solved")
                setButtonDisabled("disabled")
            }
            else{
                setButtonText(defaultButtonText)
            }
        }
        else{
            
            if( response.status == 400 ){
                setShowMessage(response.message)
                setModalShow(true)
                setButtonText(defaultButtonText)
            }
            else{
                router.push(`/${hash}/obrigado`)
            }
        }

        if( !response.status ){
            setShowMessage('Houve um erro na comunicação, tente novamente.')
            setModalShow(true)

            setButtonText(defaultButtonText)
        }
        
        
    }

    return(
        <form className={props.className ? props.className : '' } onSubmit={ props.onSubmit ? props.onSubmit : handleSubmit}>
            { props.children ? props.children :
                <input
                type="text"
                name={props.id}
                myref={props.id}
                autoComplete="off"
                placeholder="Insira a senha"
                onChange={handleInputChange}
                value={stateValue[props.id]}/>
            }
            {
                props.timerbutton ?
                <TimerButton time={props.timerbutton.time} start={props.timerbutton.start} className={buttonClass} disabled={buttonDisabled} type="submit">{buttonText}</TimerButton>
                :
                <button className={buttonClass} disabled={buttonDisabled} type="submit">{buttonText}</button> 
            }
            

            <Modal 
                show={modalShow}
                onHide={()=>setModalShow(false)}
                title="Aviso"
                >
                <p>{showMessage}</p>
            </Modal>

        </form>
    )

}