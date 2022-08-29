import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { useUser } from '../../../context/User'

export default NextAuth({

    // Configure one or more authentication providers
    providers: [
        Providers.Credentials({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            type: 'credentials',

            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.

            credentials: {
                group: { label: "Grupo", type: "text" },
                name: { label: "Nome", type: "text" },
                email: { label: "Email", type: "email" },
                registration: { label: "Nº de Matrícula", type: "text" },
                password: { label: "Senha", type: "password" },
                // add option of groups
            },
            
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                
                //const url = 'https://60ae8c985b8c300017dead2e.mockapi.io/api/v1/users'
                const res = await fetch( process.env.API_URL, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { "Content-Type": "application/json" }
                })

                const data = await res.json()

                console.log("🚀 ~ file: [...nextauth].js ~ line 43 ~ authorize ~ data", data)
                
                /*
                const res = {ok:true}
                const user = {id:1, name: 'João', email:''}
                */

                //console.log(res, user)
                //console.log("🚀 ~ file: [...nextauth].js ~ line 52 ~ authorize ~ res", res)

                const { setUser } = useUser()
                
                try {
                    // If no error and we have user data, return it
                    if (data.status == 'ok' && data.user) {
                        console.log('data.user',data.user)
                        setUser(data.user)
                        return data.user
                    }    
                }
                catch (error) {
                    return null
                }

                // Return null if user data could not be retrieved
                return null
            }
        })
        // ...add more providers here
    ],
    
    pages: {
        signIn: '/auth/credentials-signin',
        error: '/auth/error'
    },

    session: {
        jwt: true
    },

    jwt: {
        // A secret to use for key generation - you should set this explicitly
        // Defaults to NextAuth.js secret if not explicitly specified.
        // This is used to generate the actual signingKey and produces a warning
        // message if not defined explicitly.
        secret: process.env.JWT_SECRET,
        // You can generate a signing key using `jose newkey -s 512 -t oct -a HS512`
        // This gives you direct knowledge of the key used to sign the token so you can use it
        // to authenticate indirectly (eg. to a database driver)
        // signingKey: {"kty":"oct","kid":"Dl893BEV-iVE-x9EC52TDmlJUgGm9oZ99_ZL025Hc5Q","alg":"HS512","k":"K7QqRmJOKRK2qcCKV_pi9PSBv3XP0fpTu30TP8xn4w01xR3ZMZM38yL2DnTVPVw6e4yhdh0jtoah-i4c_pZagA"},
        // If you chose something other than the default algorithm for the signingKey (HS512)
        // you also need to configure the algorithm
        // verificationOptions: {
        //    algorithms: ['HS256']
        // },
        // Set to true to use encryption. Defaults to false (signing only).
        // encryption: true,
        // encryptionKey: "",
        // decryptionKey = encryptionKey,
        // decryptionOptions = {
        //    algorithms: ['A256GCM']
        // },
        // You can define your own encode/decode functions for signing and encryption
        // if you want to override the default behaviour.
        // async encode({ secret, token, maxAge }) {},
        // async decode({ secret, token, maxAge }) {},
    }
    
})