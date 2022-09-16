import React, { useState, useEffect } from 'react'
import Lottie from 'react-lottie'
// https://lottiereact.com/
import styles from './styles/Animation.module.css'

export default function Animation({ file }) {

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

    if( state.isLoading ) return <div className={styles.loading}><i className="fa-solid fa-spinner fa-spin"></i></div>

    return <div className={styles.animation}>
        <Lottie options={defaultOptions} height="100%" width="auto" isClickToPauseDisabled={true}/>
    </div>
}
