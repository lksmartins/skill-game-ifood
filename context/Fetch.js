import { useState, useEffect } from "react"

export function useFetch( body ){

    const [ isLoading, setIsLoading ] = useState(true)
    const [ value, setValue ] = useState(null)
    const [ error, setError ] = useState(null)

    useEffect(() => {

        const bodySent = {
            token: process.env.API_KEY, 
            ...body
        }

        console.log('___ useFetch ->', bodySent, process.env.API_URL)

        const handleSuccess = (data) => {
            console.log('___ useFetch -> response', data)
            setValue(data)
            setError(null)
        }

        const handleError = (data) => {
            console.log('___ useFetch -> error', data)
            setError(data)
        }

        const handleFinally = () => {
            console.log('___ useFetch -> finally')
            setIsLoading(false)
        }
        
        fetch( process.env.API_URL, {
            method: 'POST',
            body: JSON.stringify(bodySent)
        })
        .then( async (response) => {
            const json = await response.json()
            handleSuccess(json.data)
        })
        .catch((error)=>{
            handleError(error)
        })
        .finally(() => {
            handleFinally()
        })

    },[])

    return { isLoading, value, error }

}

export function funcFetch( props ){

    const bodySent = {
        token: process.env.API_KEY, 
        ...props.body
    }

    console.log('___ funcFetch ->', bodySent, process.env.API_URL)

    const handleSuccess = (data) => props.handleSuccess(data)

    const handleError = (data) => props.handleError(data)

    const handleFinally = () => props.handleFinally()
    
    fetch( process.env.API_URL, {
        method: 'POST',
        body: JSON.stringify(bodySent)
    })
    .then( async (response) => {
        const json = await response.json()
        handleSuccess(json.data)
    })
    .catch((error)=>{
        handleError(error)
    })
    .finally(() => {
        handleFinally()
    })


}