import React, { useState, useEffect } from 'react'
import Lottie from 'react-lottie'

export default function Animation({ file, height='100%', width='auto'}) {

    const [state, setState] = useState({ isStopped: false, isPaused: false, isLoading: true })
    const [animationData, setAnimationData] = useState('')

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: { 
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

    useEffect(() => {
        fetch(file)
            .then((res) => res.json())
            .then((data) => {
                setAnimationData(data)
                const newState = {...state}
                newState.isLoading = false
                setState(newState)
            })
    }, [])

    if( state.isLoading ) return <div className="fs-1 mx-auto"><i className="fa-solid fa-spinner fa-spin"></i></div>

    return <div className="overflow-hidden">
        <Lottie options={defaultOptions} height={height} width={width} isClickToPauseDisabled={true}/>
    </div>
}
