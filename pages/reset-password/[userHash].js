import React from 'react'
import { useUser } from '@context/User'
import Form from '@components/Forms/Form'
import {findValueById} from '@lib/helper'
import styles from '@styles/pages/login.module.css'

export async function getServerSideProps(context) {

    const {userHash} = context.query

    try {
        const res = await fetch(process.env.API_URL, {
            method: 'POST',
            body: JSON.stringify({
                token: process.env.API_TOKEN,
                action: 'autoLogin',
                hash: userHash
            })
        })
        const data = await res.json()

        return {
            props: {
                hash: userHash,
                email: data.user.email
            }
        }   
    }
    catch (error) {
        console.log("🚀 ~ file: [userHash].js ~ line 30 ~ getServerSideProps ~ error", error)
        return {
            props: {
                hash: userHash,
                email: null
            }
        }   
    }
    
}

export default function SignupForm(props){

    const { setUser } = useUser()
    const { email } = props

    const fields = [
        {id:'email', name:'Seu e-mail', type:'email', disabled:'disabled', value:email},
        {id:'senha', name:'Sua senha', type:'password', value:''},
        {id:'senhaConfirmacao', name:'Repita a senha', type:'password', value:''}
    ]

    if(!email){
        return(
            <div className={styles.login}>
                <h2>Esse usuário não existe. Clique <a href="/signup">aqui</a> para fazer seu cadastro.</h2>
            </div>
        )
    }

    return(
        <div className={styles.login}>

            <h2>Escolha sua nova senha abaixo:</h2>

            <Form
                fields={fields}
                apiBody={(state)=>{
                        return {  
                            action: 'resetPassword',
                            email: findValueById(state, 'email'), 
                            password: findValueById(state, 'senha')
                        }
                    }
                }
                matchPasswords={(state)=>{
                    return [
                        findValueById(state, 'senha'), 
                        findValueById(state, 'senhaConfirmacao')
                    ]
                }}
                errorMessage="Houve um erro na tentativa de redefinir sua senha. Recarregue a página e tente novamente."
                successMessage="Senha redefinida com sucesso!"
                onSuccess={(response)=>{
                    setUser(response.user)
                    if( 'onSuccess' in props ){
                        props.onSuccess()
                    }
                }}

                footerLeftEl={<a href="/login"><i className="fas fa-question-circle"></i> Esse não é o meu email</a>}
                buttonText="Redefinir Senha"
            />
        </div>
    )

}