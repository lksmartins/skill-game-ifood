import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/FormQuestions.module.css'
import { signIn, useSession, getSession } from 'next-auth/client'
import Form from '../../components/Form'

export async function getServerSideProps(context) {

	const session = await getSession(context)
    const hash = context.query.hash

    if( !session ){
        return {
            props: {
                hash: hash,
                user: null
            }
        }
    }
	
	return {
		props: {
            hash: hash,
			user: session.user.email
		}
	}
}

export default function TheEnd( props ) {

	const hash = props.hash
	const user = props.user
	const router = useRouter()

    // check login
    const [ session, loading ] = useSession()
    if( !session && !loading ) {
        signIn()
    }

	// form
	const formFields = {field1:'', field2:'', field3:'', field4:'', field5:'', field6:'', field7:'', field8:''} // the default for the satisfaction question
	const [formState, setFormState] = useState(formFields)

	const [showError, setShowError] = useState(false)
	const errorFields = {field1:false, field2:false, field3:false, field4:false, field5:false, field6:false, field7:false}
	const [errors, setErrors] = useState(errorFields)

	function handleInputChange(e){

		const target = e.target
        const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name

		updateFormState( name, value )

	}

	function updateFormState( name, value ){
		// set new obj
		let thisFormState = {};
		// clone state to new obj
		thisFormState = {...formState}
		// change new obj
		thisFormState[name] = value
		// set old state to new obj
		setFormState(thisFormState)

		console.log(thisFormState)

		if( thisFormState[name] != '' && name!='field8' ){ // ignore field 8 for validation
			updateErrorsState(name)
		}
	}

	function updateErrorsState( name, bool=false ){
		let thisFormErrors = {};
		// clone Errors to new obj
		thisFormErrors = {...errors}
		// change new obj
		thisFormErrors[name] = bool
		setErrors(thisFormErrors)

		console.log(thisFormErrors)
	}

	function createField(name){

		return (
			<>
				<textarea
					className={`form-control ${showError && errors[name] ? styles.fieldError : ''}`}
					name={name}
					autoComplete="off"
					placeholder=""
					onChange={handleInputChange}
					value={ formState[name] }/>

				<div className={showError && errors[name]==true ? styles.error : styles.hidden}>
					<i className="fas fa-exclamation-circle"></i> Esse campo ficou vazio
				</div>
			</>
		)

	}

	function customValidation(){

		let thisErrors = {...errors}
		let thisShowError = false

		Object.keys(formState).forEach(key => {
			console.log(key, formState[key])
			if( formState[key] == '' && key != 'field8' ){ // ignore field 8 from validation
				thisErrors[key] = true
				thisShowError = true
			}
		})

		if( thisShowError==true ){
			setShowError(true)
			setErrors(thisErrors)
			return false
		}
		else{
			return true
		}

	}

	return (<div className={styles.bg}>

        <div className={styles.container}>

            <div className={styles.main}>

				<Form 
					values={formState} 
					myref="form" 
					className="form block"

					hash={hash}
					user={user}
					customValidation={customValidation}
				>

					<h5 className={styles.center}>Como você avalia sua experiência com o treinamento gamificado Solarium - A Jornada do Sucesso?</h5>
					<div className={styles.satisfaction}>

						<div 
							onClick={()=>updateFormState('field1','Muito Ruim')} 
							className={`btn btn-primary ${styles.btn} ${formState.field1 == 'Muito Ruim' ? styles.active : ''}`}>
							Muito Ruim
						</div>

						<div 
							onClick={()=>updateFormState('field1','Ruim')} 
							className={`btn btn-primary ${styles.btn} ${formState.field1 == 'Ruim' ? styles.active : ''}`}>
							Ruim
						</div>

						<div 
							onClick={()=>updateFormState('field1','Bom')} 
							className={`btn btn-primary ${styles.btn} ${formState.field1 == 'Bom' ? styles.active : ''}`}>
							Bom
						</div>

						<div 
							onClick={()=>updateFormState('field1','Muito Bom')} 
							className={`btn btn-primary ${styles.btn} ${formState.field1 == 'Muito Bom' ? styles.active : ''}`}>
							Muito Bom
						</div>

						<div 
							onClick={()=>updateFormState('field1','Excelente')} 
							className={`btn btn-primary ${styles.btn} ${formState.field1 == 'Excelente' ? styles.active : ''}`}>
							Excelente
						</div>
					</div>
					<div className={showError && errors.field1 ? styles.error : styles.hidden} style={{textAlign: 'center'}}>
						<i className="fas fa-exclamation-circle"></i> Você precisa selecionar um dos botões acima
					</div>

					<h3>Missão 1</h3>
					<h5>Planejamento de atendimento e relacionamento.</h5>
					<h5 className={styles.italic}>Nesta missão você pode exercitar o entendimento das necessidades dos clientes, o planejamento da arquitetura e da adoção desde o início do processo de vendas.</h5>
					
					<p>
						Reflita sobre as decisões tomadas neste desafio. Quais os principais aprendizados você obteve nesta missão e como pode aplicar no seu dia-a-dia de vendas na SAP? 
					</p>
					{createField('field2')}

					<p>
						Existem desafios e impedimentos para aplicação destas competências na sua rotina de vendas na SAP? Como você pensa em solucioná-los? Podem ser desafios individuais, internos da empresa ou externos do mercado.
					</p>
					{createField('field3')}

					<h3>Missão 2</h3>
					<h5>Planejamento a longo prazo.</h5>
					<h5 className={styles.italic}>Nesta missão você vivenciou desafios relacionados à importância de se planejar para o futuro, tendo em vista a estratégia de migração para a estratégia CLOUD.</h5>

					<p>
						Reflita sobre as decisões tomadas neste desafio. Quais os principais aprendizados você obteve nesta missão e como pode aplicar no seu dia-a-dia de vendas na SAP? 
					</p>
					{createField('field4')}

					<p>
						Existem desafios e impedimentos para aplicação destas competências na sua rotina de vendas na SAP? Como você pensa em solucioná-los? Podem ser desafios individuais, internos da empresa ou externos do mercado.
					</p>
					{createField('field5')}

					<h3>Missão 3</h3>
					<h5>Visão do Negócio.</h5>
					<h5 className={styles.italic}>Nesta missão você pode exercitar o conceito de "caixa d´água", em que é preciso pensar não somente na venda de novos contratos, mas também na renovação para manutenção da linearidade de resultados no longo prazo.</h5>

					<p>
						Reflita sobre as decisões tomadas neste desafio. Quais os principais aprendizados você obteve nesta missão e como pode aplicar no seu dia-a-dia de vendas na SAP? 
					</p>
					{createField('field6')}

					<p>
						Existem desafios e impedimentos para aplicação destas competências na sua rotina de vendas na SAP? Como você pensa em solucioná-los? Podem ser desafios individuais, internos da empresa ou externos do mercado.
					</p>
					{createField('field7')}

					<p style={{marginTop: '30px'}}>
						Comentário (opcional)
					</p>
					{createField('field8')}

				</Form>

            </div>

        </div>

		
    </div>)
}