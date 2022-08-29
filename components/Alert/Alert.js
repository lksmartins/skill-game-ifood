import React, {useState,useEffect} from 'react'
import styles from './styles/Alert.module.css'

export default function Alert(props) {

    const {text, show, setShow} = props
    const [visible, setVisible] = useState(styles.hidden)

    useEffect(() => {

        if( !show ) return

        setVisible(styles.show)

        setTimeout(() =>{
            setVisible(styles.hidden)
            setShow(false)
        },3000)

    },[show])

    return(
        <div className={`${styles.alert} ${visible} ${props.class == 'success' && styles.success}`}>
            
            <div className={styles.icon}>
                {props.class == 'success' ? <i className="fas fa-check"></i> : <i className="fas fa-exclamation-triangle"></i>}
            </div>
            <div>{text}</div>
            
        </div>
    )
}