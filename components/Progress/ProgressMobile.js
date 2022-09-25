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

                    <div className="w-100" style={{border:'1px solid #F9F2E8', borderRadius:'0.75rem', overflow:'hidden'}}>
                        <div className={`text-center ${progress>0?'px-2 ms-2':'ms-3'}`}
                        style={{
                            backgroundColor:'#F9F2E8', 
                            width:`${progress}%`, 
                            color:'#890019',
                            textShadow: '1px 0 #F9F2E8, -1px 0 #F9F2E8, 0 1px #F9F2E8, 0 -1px #F9F2E8, 1px 1px #F9F2E8, -1px -1px #F9F2E8, 1px -1px #F9F2E8, -1px 1px #F9F2E8'}}
                            >
                                {progress}%
                            </div>
                    </div>
                </div>

            </div>

        </div>
    )
}