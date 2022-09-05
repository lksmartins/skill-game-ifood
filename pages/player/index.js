import React, { useState, useEffect, useRef } from 'react'
import { getToken } from '../../lib/helper'
import styles from './player.module.css'
import useCallbackState from '../../hooks/useCallbackState'

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
    const [slides, setSlides] = useCallbackState(questions)
    
    const [playerJourney, setPlayerJourney] = useState([slides[0]])

    const chooseAlternative = (alternative) => {

        /*
        -add proxima pergunta ao playerJourney
        -add a proxima pergunta aos Slides
        -remove o primeiro slide de Slider
        -mover para o proximo Slide
        */

        const question = findQuestion(alternative.nextQuestion)

        setPlayerJourney([...playerJourney, question])

        //const newSlides = [...slides, question]
        const activeSlide = questions.findIndex(q=>q.ref == question.ref)

        setCurrentSlide(activeSlide)
        updateSlidesPositions(moveTo(slides, activeSlide))

        /* setSlides(newSlides, ()=>{
            setCurrentSlide(activeSlide)
            setTimeout(() => {
                updateSlidesPositions(moveTo(newSlides, activeSlide))
            },1000)
        }) */

    }

    useEffect(() => {

        console.log('currentSlide')
        //setSlidesPosition()

    }, [currentSlide])

    const moveTo = (slides, moveTo) => {

        console.log('moveTo')

        const positions = []

        slides.map((slide, i)=>{

            let position = '0vw'
            position = `${(i-moveTo) * 100}vw`

            positions.push(position)

        })
        
        return positions

    }

    const [slidesPositions, updateSlidesPositions] = useState(moveTo(slides, 0))

    const getSlidesPosition = (slides) => {

        console.log('getSlidesPosition')
        console.log(slides)

        slides.map((slide, i)=>{

            let style = { left: '0vw' }

            console.log('i',i)
            console.log('currentSlide',currentSlide)

            /*
            
            i: 1, current: 0

            */

            if (i == currentSlide) {
                style.left = `0vw`
                console.log('IGUAL', style.left)
            }
            if (i > currentSlide) {
                style.left = `${(i-currentSlide) * 100}vw`
                console.log('INDEX MAIOR', style.left)
            }
            if (i < currentSlide) {
                style.left = `-${(currentSlide - i) * 100}vw`
                console.log('INDEX MENOR', style.left)
            }

            style.left = `${(i-currentSlide) * 100}vw`

            console.log('left',style.left)
            slide.style = style
            console.log('=',slide.style.left)

        })

        console.log('newSlides', slides)
        return slides

    }

    const setSlidesPosition = () => {

        console.log('setSlidesPosition')
        console.log(slides)

        const style = { left: '0vw' }
        const newSlides = JSON.parse(JSON.stringify(slides))

        newSlides.map((slide, i)=>{

            console.log('i',i)
            console.log('currentSlide',currentSlide)

            if (i == currentSlide) {
                style.left = `0vw !important`
                //console.log('IGUAL')
            }
            if (i > currentSlide) {
                style.left = `${(currentSlide - i) * 100}vw !important`
                //console.log('INDEX MAIOR')
            }
            if (i < currentSlide) {
                style.left = `-${(currentSlide - i) * 100}vw !important`
                //console.log('INDEX MENOR')
            }

            console.log('left',style.left)
            slide.style = style
            console.log('=',slide.style.left)

            /* if( i == newSlides.length-1 ){
                console.log('newSlides', newSlides)
                setSlides(newSlides)
            } */

        })

        console.log('newSlides', newSlides)
        setSlides(newSlides)

    }

    const findQuestion = (questionRef) => {
        return questions.find(item => item.ref == questionRef)
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
                            onClick={() => chooseAlternative(alternative)}
                        >
                            {alternative.text}
                        </button>
                    })
                }
            </div>)
    }

    const prevSlide = () => {
        setCurrentSlide(currentSlide-1)
        updateSlidesPositions(moveTo(slides, currentSlide-1))
    }

    const nextSlide = () => {
        setCurrentSlide(currentSlide+1)
        updateSlidesPositions(moveTo(slides, currentSlide+1))
    }

    return (
        <main>

            <div className={styles.playerJourney}>
                {
                    playerJourney.map((step, index) => {
                        return <div key={index} className={styles.step}>{step.ref}</div>
                    })
                }
            </div>

            <div className={`${styles.slider}`}>
                {
                    slides.map((slide, index) => {
                        console.log('rendering slides', slidesPositions)
                        return <div
                            key={slide.id}
                            className={`${styles.slide} ${`moveLeft_${slidesPositions[index]}`}`}
                        >
                            <h1>{slide.ref}</h1>
                            <h2>{slide.text}</h2>
                            {buildAlternatives(slide)}
                        </div>
                    })
                }
            </div>

            <div className={styles.buttons}>
                <button onClick={() => prevSlide()}>PREV</button>
                <button onClick={() => nextSlide()}>NEXT</button>
            </div>

        </main>
    )
}