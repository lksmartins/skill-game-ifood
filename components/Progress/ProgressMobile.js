import React, { useState, useEffect } from 'react'
import styles from './styles/ProgressMobile.module.css'
import { Line } from 'rc-progress'
import sacola from '../../public/Progress/sacola.svg'
import Image from 'next/image'

export default function Progress({ animationRef, progress = 50 }) {

    const [color, setColor] = useState('#F9F2E8')

    useEffect(() => {
        if (progress >= 70) setColor('#EA1D2C')
    }, [progress])

    return (
        <div className={styles.wrapper}>

            <div className={styles.text}>Seu progresso</div>

            <div className={styles.content}>

                <div className={styles.progress}>

                    <div ref={animationRef} className={styles.icon}>
                        <Image src={sacola} width="70%" height="80%" />
                    </div>

                    <Line
                        className={styles.line}
                        strokeLinecap="square"
                        percent={progress}
                        trailColor="#EA1D2C"
                        trailWidth={20}
                        strokeWidth={20}
                        strokeColor="#F9F2E8"
                    />
                    <div className={styles.percent} style={{color: color}}>{progress}%</div>
                </div>

            </div>

        </div>
    )
}