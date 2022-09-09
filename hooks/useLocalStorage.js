import { useState, useCallback } from 'react'

const isTesting = false

function localConsole(message){
    if( isTesting==true ){
        console.log( message )
    }
}

export function useLocalStorage( key, initialValue = '' ){

    const [ state, setState ] = useState(()=>{

        localConsole('LocalStorage -> useState', key, initialValue)

        try {
            const storedValue = localStorage.getItem(key)
            if( !storedValue && initialValue != '' ){
                localStorage.setItem(key, JSON.stringify(initialValue))
            }
            return storedValue ? JSON.parse(storedValue) : initialValue

        } catch{
            return initialValue
        }
    })

    const removeKey = ( value )=>{
        localStorage.removeItem(value)
    }

    const setValue = useCallback( value => {

        localConsole('LocalStorage -> setValue', key, value)

        try {
            setState(value)
            localStorage.setItem(key, JSON.stringify(value))

        } catch (error) {
            console.error(error)
        }

    }, [key])

    return [ state, setValue, removeKey ]

}