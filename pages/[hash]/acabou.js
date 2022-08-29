import React, { useState } from 'react'
import styles from '../../styles/Obrigado.module.css'

export default function Acabou() {

	return (<div className={styles.bg}>

        <div className={styles.container}>

            <div className={styles.video}>

                <img src="https://branching-stories.s3.amazonaws.com/logos/logo_sap.png"/>
                <img className={styles.poster} src="https://branching-stories.s3.amazonaws.com/SOLARIUM_720.jpg"/>
                <img src="https://branching-stories.s3.amazonaws.com/logos/logo_cm.png"/>

            </div>

            <div className={styles.main}>

                <h2>O prazo acabou!</h2>
                <p>Esperamos que você tenha conseguido tirar proveito dessa experência.</p>
                <p>O acesso era até dia 13/07 às 19h.</p>
                <p>Nos vemos em uma próxima oportunidade.</p>

                <p style={{marginTop: '30px'}}>Comitê Sales Meeting e Equipe Chave-Mestra.</p>

            </div>

        </div>

		
    </div>)
}