import { signIn } from 'next-auth/client'

export default function Error() {

  return (
    <div className="container main">

        <p>Houve um erro no seu cadastro. Você já possui uma conta com esse email, porém a senha inserida está incorreta.</p>
        <p><button className="btn btn-primary" onClick={() => signIn('Credentials',{callbackUrl:process.env.NEXTAUTH_URL}) }>Tente novamente</button></p>
      
    </div>
  )
}