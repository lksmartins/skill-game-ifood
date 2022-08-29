import { getCsrfToken } from 'next-auth/client'
import styles from '../../styles/Signin.module.css'

import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { useUser } from '../../context/User'

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    }
  }
}

export default function SignUp({ csrfToken }) {

  console.log("🚀 ~ file: credentials-signin.js ~ line 19 ~ SignUp ~ csrfToken", csrfToken)

  const { setUserLoading } = useUser()

  setUserLoading(false)

  const groups = [
    {id: 1, description: 'Teste 1'},
    {id: 2, description: 'Teste 2'},
    {id: 3, description: 'Teste 3'}
  ]

  const [ session ] = useSession()
  const router = useRouter()

  // se estiver logado joga pra home
  if(session){
    console.log("🚀 ~ file: credentials-signin.js ~ line 36 ~ SignUp ~ session", session)
    console.log("🚀 ~ file: credentials-signin.js ~ line 38 ~ SignUp ~ router", router)
    //router.push(`/${router.query}/fases`)
  }

  return (
    <div className={styles.container}>

      <form method='post' action='/api/auth/callback/credentials'>

        <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
        <input name='action' type='hidden' value="signup"/>
        <input name='token' type='hidden' value={process.env.API_KEY}/>

        <div className={styles.col}>
          <label className="form-label">Nome Completo</label>
          <input className="form-control" name='name' required type='text'/>
        </div>

        <div className={styles.col}>
          <label className="form-label">Email</label>
          <input className="form-control" name='email' required type='email'/>
        </div>

        <div className={styles.col}>
          <label className="form-label">ID Number</label>
          <input className="form-control" name='registration' required type='text'/>
        </div>

        <div className={styles.col}>
          <label className="form-label">Senha</label>
          <input className="form-control" name='password' required type='password'/>
        </div>

        <button className="btn btn-success" type='submit'>Cadastrar</button>
      </form>
    </div>
  )
}