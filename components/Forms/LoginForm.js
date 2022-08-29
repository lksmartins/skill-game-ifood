import React, { useState } from 'react'
import { useUser } from '@context/User'
import Form from '@components/Forms/Form'
import {findValueById} from '@lib/helper'

export default function LoginForm(props) {

    const { setUser } = useUser()

    const fields = [
        {id:'email', name:'Seu e-mail', type:'email', value:''},
        {id:'senha', name:'Sua senha', type:'password', forgotPassword:true, value:''}
    ]
    
    return(
        <Form
            fields={fields}
            apiBody={(state)=>{
                    return {  
                        action: 'signin',
                        email: findValueById(state, 'email'), 
                        password: findValueById(state, 'senha'),
                    }
                }
            }
            errorMessage="Houve um erro na tentativa de de fazer seu login. Recarregue a página e tente novamente."
            successMessage="Login feito com sucesso!"
            onSuccess={(response)=>{
                setUser(response.user)
                if( 'onSuccess' in props ){
                    props.onSuccess()
                }
            }}

            footerLeftEl={<a href="/signup"><i className="fas fa-question-circle"></i> Ainda não tenho cadastro, quero me cadastrar</a>}
            buttonText="Entrar"
        />
    )

}