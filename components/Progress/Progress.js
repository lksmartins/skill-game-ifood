import React from 'react'
import styles from './styles/Progress.module.css'
import { Circle } from 'rc-progress'
import sacola from '../../public/Progress/sacola.svg'
import Image from 'next/image'

export default function Progress({progress=50}) {
    return(
        <div className={styles.wrapper}>

            <div className={styles.text}>{progress}%</div>

            <div className={styles.image}>
                <Image src={sacola} width="70%" height="80%" />
            </div>

            <div className={styles.progress}>
                <Circle percent={progress} strokeWidth={4} strokeColor="#ffffff"/>
            </div>
            
        </div>
    )
}