import React, { useState, useEffect, useCallback, createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const UserContext = createContext()

export default function UserProvider({children}){

    const [ localUser, setLocalUser ] = useLocalStorage('user')
    const [ user, setUser ] = useState(localUser ? localUser : null)
    const [ userLoading, setUserLoading ] = useState(true)

    useEffect(() => {
        
        if( user != null ){
            console.log('User -> useEffect on user change',user,localUser)
            setLocalUser(user)
            setUserLoading(false)
        }

    },[user])

    return(
        <UserContext.Provider
            value={{ user, setUser, userLoading, setUserLoading }}
        >
            {children}
        </UserContext.Provider>
    )

}

export function useUser(){

    const context = useContext(UserContext)
    if( !context ) throw new Error("useUser must be used within an UserProvider")
    const { user, setUser, userLoading, setUserLoading } = context
    return { user, setUser, userLoading, setUserLoading }

}