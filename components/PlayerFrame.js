import React from 'react'
import styles from '../styles/PlayerFrame.module.css'

export default function PlayerFrame(props){

    const user = props?.user
    const avatarGender = props.avatarGender ? props.avatarGender : 1
    const profileTeam = props.profileTeam != 0 ? props.profileTeam : 1
    const wallet = props?.wallet
    const clientsLabel = props?.clientsLabel
    const clients = user?.clients ? user?.clients : 2
    const userNameArray = user ? user.name.split(' ') : []
    let userName
    if( Array.isArray(userNameArray) ){
        userName = user ? userNameArray[0] : 'Jogador'
    }

    console.log('PlayerFrame render', clients)

    return(<div>

        <div className={styles.playerSection}>
            <div className={styles.infos}>
                <div className={styles.accent}>{userName}</div>
                Carteira:
                <div className={styles.accent}>{wallet} PZ$</div>
                {clientsLabel}: 
                <div className={styles.accent}>{clients}</div>
            </div>
            <div className={styles.avatar}>
                <img src={`https://branching-stories.s3.amazonaws.com/characters/${avatarGender}_0${profileTeam}.png`}/>
            </div>
        </div>

    </div>)

}