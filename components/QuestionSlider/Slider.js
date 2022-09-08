import React, { useState } from 'react'
import styles from './styles/Slider.module.css'

export default function Slider({ slides, controls, mapControls, setNextQuestion, addToJourney }) {

    const [currentSlide, setCurrentSlide] = useState(0)
    const [currentAlternative, setCurrentAlternative] = useState(null)

    const chooseAlternative = (alternative) => {

        setCurrentAlternative(alternative)
        setNextQuestion(alternative.nextQuestion)
    }

    const confirmAlternative = () => {

        const question = findQuestion(currentAlternative.nextQuestion)
        const activeSlide = slides.findIndex(q => q.ref == question.ref)

        console.log('mapcontrols')
        console.log(mapControls)

        // move ifood bag on map
        console.log('open map')
        mapControls.open()
        mapControls.setIsMapAnimating(true)
        setNextQuestion(null)

        setTimeout(() => {
            console.log('addToJourney')
            addToJourney(question.ref)

            setTimeout(() => {
                console.log('close map')
                mapControls.close()

                // move slide
                setTimeout(() => {
                    console.log('move slides')
                    mapControls.setIsMapAnimating(false)
                    setCurrentSlide(activeSlide)
                    updateSlidesPositions(moveTo(slides, activeSlide))
                }, 1600)

            }, 1800)

        }, 1250)

    }

    const moveTo = (slides, moveTo) => {

        const positions = []

        slides.map((slide, i) => {

            let position = '0vw'
            position = `${(i - moveTo) * 100}vw`

            positions.push(position)

        })

        return positions

    }

    const [slidesPositions, updateSlidesPositions] = useState(moveTo(slides, 0))

    const findQuestion = (questionRef) => {
        return slides.find(item => item.ref == questionRef)
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
                            className={`${styles.alternative} ${currentAlternative?.ref == alternative.ref && styles.selected}`}
                            onClick={() => chooseAlternative(alternative)}
                        >
                            {alternative.text}
                        </button>
                    })
                }
            </div>)
    }

    const prevSlide = () => {
        setCurrentSlide(currentSlide - 1)
        updateSlidesPositions(moveTo(slides, currentSlide - 1))
    }

    const nextSlide = () => {
        setCurrentSlide(currentSlide + 1)
        updateSlidesPositions(moveTo(slides, currentSlide + 1))
    }

    if( mapControls.isMapAnimating ) return <div className={`${styles.slider} ${!mapControls.isOpen ? styles.mapOpen : styles.mapClosed}`}>
        Carregando...
    </div>

    return (<>
        <div className={`${styles.slider} ${!mapControls.isOpen ? styles.mapOpen : styles.mapClosed}`}>

            {slides.map((slide, index) => {
                return <div
                    key={slide.id}
                    className={`${styles.slide} ${`moveLeft_${slidesPositions[index]}`}`}
                >
                    <div className={styles.title}>
                        {slide.ref} - {slide.text}
                    </div>
                    <div className={styles.image}>
                        <img src={'image' in slide && slide.image ? slide.image : '/QuestionSlider/placeholder.png'} />
                    </div>
                    <div className={styles.alternatives}>
                        {buildAlternatives(slide)}
                        <button className={styles.confirm} onClick={() => confirmAlternative()}>Confirmar</button>
                    </div>
                </div>
            })
            }
        </div>

        {controls && <div className={styles.controls}>
            <button onClick={() => prevSlide()}>PREV</button>
            <button onClick={() => nextSlide()}>NEXT</button>
        </div>}
    </>)
}