import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './styles/TopBar.module.css'
import Progress from '@components/Progress/ProgressMobile'

export default function TopBar({progress, progressRef}) {
    return(
        <div className={styles.topbar}>
            
            <Link href="/"><a><Image src="/ifood-logo.svg" width="100" height="80" objectFit="contain" /></a></Link>
            
            <div className={styles.colProgress}>
                <Progress progress={progress} animationRef={progressRef}/>
            </div>
            
        </div>
    )
}