import React, { useState, useEffect } from 'react'
import { getToken } from '../../lib/helper'
import styles from './player.module.css'

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
    const [currentSlide, setCurrentSlide] = useState(0)
    const [slides, setSlides] = useState([
        questions[0]
    ])
    const [playerJourney, setPlayerJourney] = useState([slides[0]])
    const sliderClasses = [styles.first, styles.second, styles.third]

    const chooseAlternative = (alternative)=>{

        /*
        -add proxima pergunta ao playerJourney
        -add a proxima pergunta aos Slides
        -remove o primeiro slide de Slider
        -mover para o proximo Slide
        */

        const question = findQuestion(alternative.nextQuestion)

        setPlayerJourney( [...playerJourney, question] )

        setSlides( [...slides, question] )

        setCurrentSlide(currentSlide+1)

    }

    const findQuestion = (questionRef)=>{
        return questions.find(item=>item.ref==questionRef)
    }

    const buildAlternatives = (question) => {
        if (!('alternativesRelation' in question)) return
        const alternatives = question.alternativesRelation
        if (alternatives == null) return
        if (alternatives.length == 0) return

        return (
            <div className={styles.alternatives}>
                {
                    alternatives.map(alternative => {
                        return <button title={alternative.nextQuestion}
                                key={alternative.id} 
                                className={styles.alternative}
                                onClick={()=>chooseAlternative(alternative)}
                                >
                            {alternative.text}
                        </button>
                    })
                }
            </div>)
    }

    const prevSlide = () => {
        setCurrentSlide(prev => {
            if (prev == 0) return 0
            return prev - 1
        })
    }

    const nextSlide = () => {
        setCurrentSlide(prev => {
            if (prev == slides.length - 1) return slides.length - 1
            return prev + 1
        })
    }

    return (
        <main>

            <div className={styles.playerJourney}>
                {
                    playerJourney.map(step=>{
                        return <div className={styles.step}>{step.ref}</div>
                    })
                }
            </div>

            <div className={`${styles.slider}`}>
                {
                    slides.map((slide, index) => {

                        let style = {left:'0'}
                        /*
                        index: 0, currentSlide: 0
                        index: 1, currentSlide: 0
                        index: 2, currentSlide: 0
                        */
                        if( currentSlide > index ){
                            style.left = `-${index*100}vw !important`
                        }
                        if( currentSlide < index ){
                            style.left = `${index*100}vw !important`
                        }
                        if( currentSlide == index ){
                            style.left = `0 !important`
                        }

                        console.log('index', index)
                        console.log('style', style)

                        return <div
                            key={slide.id}
                            className={`${styles.slide}`}
                            style={style}
                        >
                            <h1>{slide.text}</h1>
                            {buildAlternatives(slide)}
                        </div>
                    })
                }
            </div>

            <div className={styles.buttons}>
                <button onClick={() => prevSlide()}>PREV</button>
            </div>

        </main>
    )
}