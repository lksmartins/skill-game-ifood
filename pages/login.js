import React from 'react'
import styles from '../styles/pages/login.module.css'
import LoginForm from '../components/Forms/LoginForm'
import {useRouter} from 'next/router'
import {useLocalStorage} from '../context/LocalStorage'

export default function login() {
    const router = useRouter()
    const [ localSignupRedirect, setLocalSignupRedirect, removeLocalSignupRedirect ] = useLocalStorage('signupRedirect')
    const onSuccess = ()=>{        
        console.log('onSuccess on login.js')
        if(localSignupRedirect){
            const redirect = JSON.stringify(localSignupRedirect).replace('"','').replace('"','')
            removeLocalSignupRedirect('signupRedirect')
            console.log("🚀 ~ file: login.js ~ line 16 ~ onSuccess ~ redirect", redirect)
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
                <h2>Para iniciar o jogo é necessário fazer o login:</h2>
            }
            <LoginForm onSuccess={onSuccess}/>
            
        </div>
    )
}