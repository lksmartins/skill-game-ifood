import React from 'react'
import styles from '../styles/Loading.module.css'

export default function components() {
    return(
        
        <div className={styles.bg}>
            <div className={styles.container}>
                <div className={styles.main}>
                    <i className="fas fa-spin fa-circle-notch"></i>
                    Carregando
                </div>
            </div>
        </div>

    )
}