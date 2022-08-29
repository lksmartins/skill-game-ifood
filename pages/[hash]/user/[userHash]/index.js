import React, { useEffect } from 'react'
import { useUser } from '../../../../context/User'
import Loading from '../../../../components/Loading'

export async function getServerSideProps(context) {
	
	return {
		props: {
            groupHash: context.query.hash,
            userHash: context.query.userHash
		}
	}
}


export default function UserHash(props){

    const { user, setUser } = useUser()

    console.log('USER HASH -> props', props)

    useEffect(()=>{

        if( user ){

            if (!('groupHash' in user)){

                setUser( prevUser => ({...prevUser,
                    userHash: props.userHash,
                    groupHash: props.groupHash
                }) )

            }

        }

    },[user])

    return (

        <Loading/>

    )

}