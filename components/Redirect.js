import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Redirect() {

    const router = useRouter()

    useEffect(() => {

        const hostname = window.location.hostname

        // only show resetPlayer with these domains
        if( hostname == 'desafiosap.com.br' && router.pathname != '/[hash]/acabou' ){
            console.log('REDIRECT')
            router.push('/6c300461/acabou')
        }
    
    },[router])

	return null
}