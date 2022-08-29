import { useState, useCallback } from 'react'

export function useLocalStorage( key, initialValue = '' ){

    const [ state, setState ] = useState(()=>{

        console.log('LocalStorage -> useState', key, initialValue)

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

        console.log('LocalStorage -> setValue', key, value)

        try {
            setState(value)
            localStorage.setItem(key, JSON.stringify(value))

        } catch (error) {
            console.error(error)
        }

    }, [key])

    return [ state, setValue, removeKey ]

}