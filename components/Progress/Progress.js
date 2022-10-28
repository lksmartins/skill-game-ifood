import React, { useState, useEffect } from 'react'
import styles from './styles/Progress.module.css'
import { Circle } from 'rc-progress'
import sacola from '../../public/Progress/sacola.svg'
import Image from 'next/image'
import Modal from './Modal'
import GaEvents from './GaEvents'

export default function Progress({ map, animationRef, progress = 50 }) {

    const [showModal, setShowModal] = useState(false)
    const [userClosedModal, setUserClosedModal] = useState(false)

    useEffect(() => {

        if (progress >= 100) {
            if (userClosedModal == false) setShowModal(true)
        }

    }, [progress])

    return (
        <div className={styles.wrapper}>

            <GaEvents progress={progress}/>

            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                    setUserClosedModal(true)
                }}
                map={map}
            />

            <div className={styles.text}>Seu progresso</div>

            <div className={styles.content} style={{ cursor: progress >= 100 ? 'pointer' : '' }} onClick={() => { if (progress >= 100) setShowModal(true) }}>

                <div ref={animationRef} className={styles.icon}>
                    <Image src={sacola} width="70%" height="80%" />
                </div>

                <div className={styles.progress}>
                    <Circle percent={progress} trailColor="#F9F2E8" trailWidth={2} strokeWidth={6} strokeColor="#FFCE45" />
                </div>

                <div className={styles.percent}>{progress}%</div>
            </div>

        </div>
    )
}