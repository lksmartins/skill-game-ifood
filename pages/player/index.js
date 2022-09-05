import React, { useState } from 'react'
import { getToken } from '../../lib/helper'
import styles from './player.module.css'
import Map from '../../components/Map/Map'
import Slider from '../../components/QuestionSlider/Slider'

export async function getServerSideProps() {

    const jwt = await getToken()

    const res = await fetch(`${process.env.API_URL}/questions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': jwt
        }
    })

    const data = await res.json()

    return {
        props: {
            questions: data
        }
    }

}

export default function Player(props) {

    const { questions } = props

    return (
        <main>

            {/* <div className={styles.playerJourney}>
                {
                    playerJourney.map((step, index) => {
                        return <div key={index} className={styles.step}>{step.ref}</div>
                    })
                }
            </div> */}

            <Map/>

            <Slider slides={questions} controls={true}/>

        </main>
    )
}