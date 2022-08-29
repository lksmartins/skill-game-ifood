import React, { useState } from 'react'
import styles from '../../styles/Obrigado.module.css'
import { signIn, useSession } from 'next-auth/client'

export default function Obrigado() {

    // check login
    const [ session, loading ] = useSession()
    if( !session && !loading ) {
        signIn()
    }

	return (<div className={styles.bg}>

        <div className={styles.container}>

            <div className={styles.video}>

                <img src="https://branching-stories.s3.amazonaws.com/logos/logo_sap.png"/>
                <img className={styles.poster} src="https://branching-stories.s3.amazonaws.com/SOLARIUM_720.jpg"/>
                <img src="https://branching-stories.s3.amazonaws.com/logos/logo_cm.png"/>

            </div>

            <div className={styles.main}>

                <h2>Parabéns!</h2>
                <p>Você foi persistente e chegou ao final do nosso treinamento gamificado!</p>
                <p>Essa é uma das características que entendemos ser muito importante para o nosso time. Ter garra e persistência para vencer todos os obstáculos, atenção a todos os detalhes durante o percurso, e ter mente aberta para aceitar novos desafios são atitudes e características essenciais para bons resultados na jornada Cloud: uma nova aventura com muitos detalhes que estamos descobrindo e tendo que se reinventar ao mesmo tempo.</p>
                <p>Sabemos que as questões eram longas, mas necessárias para trazer todos os detalhes dos desafios que estamos enfrentando hoje nos times e como empresa, e para que vocês se sentissem em um ambiente simulado. Esperamos que a aventura tenha sido divertida!</p>
                <p>O intuito do game foi o de abordar as dificuldades relatadas na empresa envolvendo-os em um momento leve e divertido. As respostas irão nos ajudar a mapear como evoluir juntos como empresa na jornada Cloud.</p>
                <p>Comitê Sales Meeting</p>

            </div>

        </div>

		
    </div>)
}