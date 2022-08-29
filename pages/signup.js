import React from 'react'
import styles from '../styles/pages/login.module.css'
import SignupForm from '../components/Forms/SignupForm'
import {useLocalStorage} from '../context/LocalStorage'
import {useRouter} from 'next/router'

export default function signup() {

    const router = useRouter()
    const [ localSignupRedirect, setLocalSignupRedirect, removeLocalSignupRedirect ] = useLocalStorage('signupRedirect')
    const onSuccess = ()=>{        
        if(localSignupRedirect){
            const redirect = JSON.stringify(localSignupRedirect).replace('"','').replace('"','')
            removeLocalSignupRedirect('signupRedirect')
            router.push(redirect)
        }
        else{
            router.push('/')
        }
    }

    return(
        <div className={styles.login}>
            
            {
                localSignupRedirect && 
                <h2>Para iniciar o jogo é necessário concluir o cadastro abaixo:</h2>
            }
            <SignupForm onSuccess={onSuccess}/>
            
        </div>
    )
}