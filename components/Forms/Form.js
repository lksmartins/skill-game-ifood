import React, { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import PropTypes from 'prop-types'
import ForgotPassword from '@components/Forms/ForgotPassword'
export default function Form(props) {

    const { fields, apiBody, errorMessage='Houve um erro inesperado. Recarregue a página e tente novamente.', successMessage, onSuccess, footerLeftEl, buttonText } = props
    const [state, setState] = useState(fields)

    const formRef = useRef()
    const [sentMessage, setSentMessage] = useState('')
    const [error, setError] = useState(false)
    
    const defaultSendIcon = 'fas fa-arrow-circle-right'
    const [sendIcon, setSendIcon] = useState(defaultSendIcon)

    const [buttonDisabled, setButtonDisabled] = useState(false)

    const [ recaptchaHelp, setRecaptchaHelp ] = useState(false)
    const recaptchaRef = useRef()

    function handleInputChange(e) {

        const target = e.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name

        let newState = [...state]
        
        newState.map((item, index)=>{
            if( item.id == name ){
                newState[index].value = value
            }
        })
    
        setState(newState)
    }

    async function handleSubmit(e) {

        e.preventDefault()

        setRecaptchaHelp(false)
        setSentMessage('')
        setError(false)

        let skipRecaptcha = false

        if( window !== undefined ){
            if( window.location.hostname == 'localhost' || window.location.hostname == '192.168.100.113' ) skipRecaptcha = true
        }

        if( skipRecaptcha == false ){

            const recaptchaValue = recaptchaRef.current.getValue()

            if( recaptchaValue=='' ){
            setRecaptchaHelp(true)
            return false
            }
        }

        let filledFields = 0
        let requiredFields = 0

        state.map(item=>{
            if( item.type == 'text' || item.type == 'email' ){

                requiredFields++

                if( item.value != '' ){
                    filledFields++
                }
            }
        })

        if( filledFields != requiredFields ){
            setError(true)
            setSentMessage('Algum campo ficou vazio.')
            return false
        }

        // match passwords
        if( props.matchPasswords ){
            const passwords = props.matchPasswords(state)

            if( passwords[0] != passwords[1] ){
                setError(true)
                setSentMessage('As senhas devem ser iguais')
                return false
            }
        }

        // load button
        //setSendIcon('fas fa-spin fa-spinner')
        //setButtonDisabled(true)
        
        //console.log({...apiBody, token: process.env.API_TOKEN})
        
        setError(false)
        setSentMessage(successMessage)

        onSuccess(state)
        
    }

    return(
        <form ref={formRef} onSubmit={handleSubmit}>

            <div className="container d-flex flex-column justify-content-center align-items-center">

                {state.map(item=>{

                    return item.type == 'checkbox' ? 
                        <div key={item.id} className="form-check d-flex justify-content-center align-items-center gap-2 mb-4 mt-2">
                            <input ref={'ref' in item ? item.ref : null} className="form-check-input" style={{width: '3.5rem', maxWidth:'40px', height: '2rem'}} name={item.id} disabled={item.disabled && item.disabled} type={item.type} onChange={handleInputChange} value={item.value && item.value}/>
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                {item.name}
                            </label>
                        </div>  
                    : (
                        <div key={item.id} className={`mb-2 w-100`}>
                            <label className="mb-1">{item.name}</label>
                            <input className={`form-control`} name={item.id} disabled={item.disabled && item.disabled} type={item.type} onChange={handleInputChange} value={item.value && item.value}/>
                            {item.forgotPassword && <ForgotPassword/>}
                        </div>
                    )
                })}

                <div className={`${sentMessage==''?'hidden':'show'} w-100 mb-3`}>
                    <div className={`bg-light w-100 p-1 text-center rounded ${!error ? 'text-success' : 'text-danger'}`}>{sentMessage}</div>
                </div>

                <div className="mt-3 mb-5">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.RECAPTCHA_KEY}
                    />
                    <span className={recaptchaHelp ? 'show' : 'hidden'}>Não esqueça de fazer o reCAPTCHA</span>
                </div>

                <div className="row w-100">
                    <div className="col-sm-4 col-12 p-0 pe-sm-1 order-1 order-sm-0">{footerLeftEl}</div>
                    <div className="col-sm-8 col-12 p-0 ps-sm-1 mb-3 mb-sm-0">
                        <button className="btn-ifood gold" disabled={buttonDisabled} type="submit">
                            {buttonText} <i className={`ms-1 ${sendIcon}`}></i>
                        </button>
                    </div>
                </div>

            </div>

        </form>
    )

}

Form.propTypes = {
    fields: PropTypes.array,
    apiBody: PropTypes.func, 
    matchPasswords: PropTypes.func,
    errorMessage: PropTypes.string, 
    successMessage: PropTypes.string, 
    onSuccess: PropTypes.func,
    footerLeftEl: PropTypes.element,
    buttonText: PropTypes.string,
}