import React from 'react'
import styles from './styles/Progress.module.css'
import { Circle } from 'rc-progress'
import sacola from '../../public/Progress/sacola.svg'
import Image from 'next/image'

export default function Progress({animationRef, progress=50}) {
    return(
        <div className={styles.wrapper}>

            <div className={styles.text}>{progress}%</div>

            <div ref={animationRef} className={styles.image}>
                <Image src={sacola} width="70%" height="80%" />
            </div>

            <div className={styles.progress}>
                <Circle percent={progress} trailWidth={2} strokeWidth={6} strokeColor="#ffffff"/>
            </div>
            
        </div>
    )
}