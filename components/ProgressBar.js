import React from 'react'
import styles from '../styles/ProgressBar.module.css';

export default function ProgressBar(props) {

    let numberClass = parseInt(props.number.charAt(0))
    if( props.number == '100,00' ){
        numberClass = 10
    }
    const color = props.color || 'white'

    return(
        <div className={styles.container}>
            <div className={styles.progressbar}>
                <div className={styles.elements}>
                    <div className={styles.element} style={numberClass>=1?{backgroundColor:color}:null}></div>
                    <div className={styles.element} style={numberClass>=2?{backgroundColor:color}:null}></div>
                    <div className={styles.element} style={numberClass>=3?{backgroundColor:color}:null}></div>
                    <div className={styles.element} style={numberClass>=4?{backgroundColor:color}:null}></div>
                    <div className={styles.element} style={numberClass>=5?{backgroundColor:color}:null}></div>
                    <div className={styles.element} style={numberClass>=6?{backgroundColor:color}:null}></div>
                    <div className={styles.element} style={numberClass>=7?{backgroundColor:color}:null}></div>
                    <div className={styles.element} style={numberClass>=8?{backgroundColor:color}:null}></div>
                    <div className={styles.element} style={numberClass>=9?{backgroundColor:color}:null}></div>
                    <div className={styles.element} style={numberClass>=10?{backgroundColor:color}:null}></div>
                </div>
            </div>
            <div className={styles.text} style={{color:color}}>
                {props.text || null}
            </div>
        </div>
    )

}