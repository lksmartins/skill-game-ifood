import React from 'react'
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/client'
import Button from '../../../components/Button'
import styles from '../../../styles/Start.module.css'

export default function UserHash(){

    const router = useRouter()
    const groupHash = router.query.hash

    const domain = process.env.ENV == 'dev' ? 'http://localhost:3000' : 'https://branching-stories-frontend.vercel.app'

    return (
        <div className={styles.bg}>
            <div className={styles.container}>
                <p>Esse usuário não existe, você pode clicar no botão abaixo para fazer seu cadastro.</p>
                <Button onClick={()=>signIn(null, {callbackUrl: `${domain}/${groupHash}`})}>Cadastrar</Button>
            </div>
        </div>
    )

}