import React, { useState, useRef } from 'react'
import styles from './styles/ContactForm.module.css'
import ReCAPTCHA from 'react-google-recaptcha'

export default function EmailForm(props) {

    const fields = [
        {id:'email', name:'Seu E-mail', type:'email', value:''},
        {id:'nome', name:'Seu nome', type:'text', value:''},
        {id:'empresa', name:'Sua empresa', type:'text', value:''},
        {id:'mensagem', name:'Escreva sua mensagem', type:'text', value:''},
        //{id:'news', name:'Quer receber nossa News Letter?', type:'checkbox', value:''},
    ]

    const formRef = useRef()
    const [stateValue, setValue] = useState(fields)
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

        let newState = [...stateValue]
        
        newState.map((item, index)=>{
            if( item.id == name ){
                newState[index].value = value
            }
        })
    
        setValue(newState)
    }

    async function handleSubmit(e) {

        //console.log('handleSubmit',stateValue)

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

        stateValue.map(item=>{
            if( item.type == 'text' || item.type == 'email' ){

                requiredFields++

                if( item.value != '' ){
                    filledFields++
                }
            }
        })

        //console.log(filledFields, requiredFields)

        if( filledFields != requiredFields ){
            setError(true)
            setSentMessage('Algum campo ficou vazio.')
            return false
        }

        // load button
        setSendIcon('fas fa-spin fa-spinner')
        setButtonDisabled(true)

        const apiBody = JSON.stringify({ 
            token:'ZqoonA3fxMpXZeOCoJ5VIXmYjVdTqxyF', 
            action: 'formFromCorpSite2022',
            email: stateValue[0].value, 
            name: stateValue[1].value, 
            company: stateValue[2].value, 
            message: stateValue[3].value,
            //news: stateValue[4].value,
            emailTo: props.emailTo ? props.emailTo : 'corporativo@chavemestra.net',
            subject: 'Email do site Skill Game'
        })
        
        console.log(apiBody)
        
        const res = await fetch('https://chave-mestra.net/api/cm/index.php', {
            method: 'POST',
            body: apiBody
        })

        try {

            const response = await res.json()

            //console.log(res.status, response)

            setButtonDisabled(false)
            setSendIcon(defaultSendIcon)

            if( !response.status ){
                setError(true)
                setSentMessage('Houve um erro na tentativa de enviar sua mensagem. Recarregue a página e tente novamente.')
            }
            
            if( response.status != 202 ){
                setError(true)
                setSentMessage('Houve um erro na tentativa de enviar sua mensagem. Recarregue a página e tente novamente.')
            }
            else{
                setError(false)
                setSentMessage('E-mail enviado com sucesso!')
            }

        } catch (error) {
            setButtonDisabled(false)
            setSendIcon(defaultSendIcon)
            setError(true)
            setSentMessage('Houve um erro na tentativa de enviar sua mensagem. Recarregue a página e tente novamente.')
        }        
        
    }

    return(
        <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.container}>

                {fields.map(item=>{
                    return (
                        <div key={item.id} className={`${styles.inputGroup} ${item.type == 'checkbox' ? styles.inline : null}`}>
                            <label>{item.name}</label>
                            <input name={item.id} type={item.type} onChange={handleInputChange}/>
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
                    <div className={styles.forHover}>
                        <button disabled={buttonDisabled} type="submit">Enviar</button>
                        <button disabled={buttonDisabled} type="submit"><i className={sendIcon}></i></button>
                    </div>
                </div>

            </div>

        </form>
    )

}