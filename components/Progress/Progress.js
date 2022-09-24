import React from 'react'
import styles from './styles/Progress.module.css'
import { Circle } from 'rc-progress'
import sacola from '../../public/Progress/sacola.svg'
import Image from 'next/image'

export default function Progress({animationRef, progress=50}) {
    return(
        <div className={styles.wrapper}>

            <div className={styles.text}>Seu progresso</div>

            <div className={styles.content}>

                <div ref={animationRef} className={styles.icon}>
                    <Image src={sacola} width="70%" height="80%" />
                </div>

                <div className={styles.progress}>
                    <Circle percent={progress} trailWidth={2} strokeWidth={6} strokeColor="#ffffff"/>
                </div>

                <div className={styles.percent}>{progress}%</div>
            </div>

            
            
        </div>
    )
}