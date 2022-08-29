import { useEffect } from 'react'
import { useUser } from '../context/User'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/client'

export async function getServerSideProps(context) {

    const hash = context.query.hash
	
	return {
		props: {
            hash: hash
		}
	}
}

export async function autoLogin( user, setUser, userLoading, setUserLoading ){

    const query = window.location.pathname.split('/')

    const userHash = query[3]

    if( userHash == undefined ) return false

    const res = await fetch( process.env.API_URL, {
		method: 'POST',
		body: JSON.stringify({
			action: 'autoLogin',
            token: process.env.API_KEY,
            hash: userHash
		})
	})

	const auth = await res.json()

    if( userLoading && auth.user != user ){
        setUser( auth.user )
        setUserLoading(false)
    }

}

export function isRouteProtected( pathname ){

    if( pathname.includes('/[hash]/') || pathname.includes('/missoes') ){
        return true
    }
    else{
        return false
    }

}

export default function Login(props){

    const router = useRouter()
    const { user, setUser, userLoading, setUserLoading } = useUser()
    const groupHash = router.query.hash
    const [ session, loading ] = useSession()

    useEffect(() => {

        //console.log('Login -> useEffect: user, userLoading',user, userLoading )

        //if( router.pathname == '/[hash]/user/[userHash]' router.pathname.includes('/user/') ){
        if( router.pathname.includes('/user/') ){
            if( !router.pathname.includes('/report') ){
                autoLogin( user, setUser, userLoading, setUserLoading )
            }
        }
        else{
            if( !user && !userLoading && isRouteProtected(router.pathname) ){
                if( !session && !loading && !router.pathname.includes('credentials') ){
                    console.log('!session && !loading', userLoading)
                    setUserLoading( false )
                    //signIn()
                }
                if( session && !loading){
                    setUser(session.user)
                    setUserLoading(false)
                }
            }
        }

    },[])

    useEffect(()=>{

        //console.log('Login -> useEffect: userLoading', userLoading)

        if(!userLoading) {
            //console.log('USER DONE LOADING')

            if( user!=null ){

                //console.log('pathname', router.pathname)

                console.log('USER LOGGED IN')
                if( router.pathname == '/[hash]/user/[userHash]' ){
                    router.push(`/${groupHash}`)
                }
                /* if( router.pathname == '/[hash]/user/[userHash]/report' ){
                    router.push(`/${groupHash}/report`)
                } */
            }
            else{
                console.log('USER NOT LOGGED IN')
                if( !router.pathname.includes('credentials') ){
                    router.push(`/${groupHash}/user/error`)
                }
            }
        }
    },[userLoading])

    return null
}