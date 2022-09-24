import React from 'react'
import Image from 'next/image'
import styles from './styles/TopBar.module.css'
import Progress from '@components/Progress/ProgressMobile'

export default function TopBar({progress, progressRef}) {
    return(
        <div className={styles.topbar}>
            
            <Image src="/ifood-logo.svg" width="100" height="80" objectFit="contain" />
            
            <div className={styles.colProgress}>
                <Progress progress={progress} animationRef={progressRef}/>
            </div>
            
        </div>
    )
}