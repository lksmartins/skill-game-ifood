import React, { useState } from 'react'
import Modal from '@components/Modal'
import Form from '@components/Forms/Form'
import {findValueById} from '@lib/helper'

export default function ForgotPassword(props) {

    const [ show, setShow ] = useState(false)

    const fields = [
        {id:'email', name:'Seu e-mail', type:'email', value:''}
    ]

    return <>
            <span onClick={()=>setShow(true)}><i className="fas fa-question-circle"></i> Esqueci minha senha</span>
        
            <Modal
                show={show}
                color="blue" 
                size="md"
                type="booking"
                onHide={()=>{
                    setShow(false)
                }}
                hasfooter="false"
                title="Esqueci minha senha">

                <div>
                
                    <Form 
                        fields={fields}
                        apiBody={(state)=>{
                                return {
                                    action: 'forgotPassword',
                                    email: findValueById(state, 'email')
                                }
                            }
                        }
                        successMessage={"Solicitação efetuada com sucesso. Verifique seu email."}
                        buttonText="Enviar"
                    />
                
                </div>

            </Modal>
        </>
}