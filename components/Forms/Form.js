import React, { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import PropTypes from 'prop-types'
import styles from '@components/Forms/styles/form.module.css'
import ForgotPassword from '@components/Forms/ForgotPassword'

/*
    Where its being used:
    -Footer
    -ihunter-sobre
    -LoginForm
    -SignupForm
    -ForgotPassword
*/

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

        const recaptchaValue = recaptchaRef.current.getValue()

        if( recaptchaValue=='' ){
          setRecaptchaHelp(true)
          return false
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
        setSendIcon('fas fa-spin fa-spinner')
        setButtonDisabled(true)
        
        //console.log({...apiBody, token: process.env.API_TOKEN})
        
        fetch(process.env.API_URL, {
            method: 'POST',
            body: JSON.stringify({...apiBody(state), token: process.env.API_TOKEN})
        })
        .then(res=>{
            res.json().then(response=>{
                setButtonDisabled(false)
                setSendIcon(defaultSendIcon)
    
                if( !response.status || response.status != 'ok' ){
                    setError(true)
                    setSentMessage(response.msg || errorMessage)
                }
                else{
                    setError(false)
                    setSentMessage(successMessage)
    
                    onSuccess(response)
                }
            })
            .catch(error=>{
                console.error('error on .json()')
                console.error(error)
                console.log(apiBody)
                
                setButtonDisabled(false)
                setSendIcon(defaultSendIcon)
                setError(true)
                setSentMessage(errorMessage)
            })
        })
        .catch(error=>{
            console.error('error on fetch()')
            console.error(error)
            console.log(apiBody)

            setButtonDisabled(false)
            setSendIcon(defaultSendIcon)
            setError(true)
            setSentMessage(errorMessage)
        })
        
    }

    return(
        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.container}>

                {state.map(item=>{
                    return (
                        <div key={item.id} className={`${styles.inputGroup} ${item.type == 'checkbox' ? styles.inline : null}`}>
                            <label>{item.name}</label>
                            <input name={item.id} disabled={item.disabled && item.disabled} type={item.type} onChange={handleInputChange} value={item.value && item.value}/>
                            {item.forgotPassword && <ForgotPassword/>}
                        </div>
                    )
                })}

                <div className={`${styles.inputGroup} ${styles.recaptcha}`}>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.RECAPTCHA_KEY}
                        theme="dark"
                    />
                    <span className={recaptchaHelp ? styles.show : styles.hidden}>Não esqueça de fazer o reCAPTCHA</span>
                </div>

                <div className={`${styles.messageGroup} ${sentMessage==''?styles.hidden:styles.show}`}>
                    <div className={!error?styles.success:styles.error}>{sentMessage}</div>
                </div>

                <div className={styles.buttonGroup}>
                    <div>{footerLeftEl}</div>
                    <div className={styles.forHover}>
                        <button disabled={buttonDisabled} type="submit">{buttonText}</button>
                        <button disabled={buttonDisabled} type="submit"><i className={sendIcon}></i></button>
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