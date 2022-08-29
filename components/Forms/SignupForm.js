import React from 'react'
import { useUser } from '@context/User'
import Form from '@components/Forms/Form'
import {findValueById} from '@lib/helper'

export default function SignupForm(props){

    const { setUser } = useUser()

    const fields = [
        {id:'nome', name:'Seu nome', type:'text', value:''},
        {id:'email', name:'Seu e-mail', type:'email', value:''},
        {id:'senha', name:'Sua senha', type:'password', value:''},
        {id:'senhaConfirmacao', name:'Repita a senha', type:'password', value:''}
    ]

    return(
        <Form
            fields={fields}
            apiBody={(state)=>{
                    return {  
                        action: 'signup',
                        name: findValueById(state, 'nome'), 
                        email: findValueById(state, 'email'), 
                        password: findValueById(state, 'senha'),
                        registration: 'null'
                    }
                }
            }
            matchPasswords={(state)=>{return [findValueById(state, 'senha'), findValueById(state, 'senhaConfirmacao')]}}
            errorMessage="Houve um erro na tentativa de fazer seu cadastro. Recarregue a página e tente novamente."
            successMessage="Cadastro feito com sucesso!"
            onSuccess={(response)=>{
                setUser(response.user)
                if( 'onSuccess' in props ){
                    props.onSuccess()
                }
            }}

            footerLeftEl={<a href="/login"><i className="fas fa-question-circle"></i> Já tenho cadastro, quero fazer login</a>}
            buttonText="Cadastrar"
        />
    )

}