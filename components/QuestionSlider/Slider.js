import React, { useState, useEffect, useRef } from 'react'
import styles from './styles/Slider.module.css'

const sliderTesting = false

const sliderConsole = (message) => {

    if (sliderTesting) {
        console.log(message)
    }

}

export default function Slider({
    slides,
    moveTo,
    currentSlide,
    setCurrentSlide,
    slidesPositions,
    updateSlidesPositions,
    mapControls,
    setNextQuestion,
    alternativeAnimation
}) {

    const [currentAlternative, setCurrentAlternative] = useState(null)

    const chooseAlternative = (alternative) => {

        setCurrentAlternative(alternative)
        setNextQuestion(alternative.nextQuestion)

        //mapControls.open()

        const elements = document.getElementsByClassName(styles.confirm)
        let confirm
        for (const item of elements) {
            if (item.getAttribute('qref') == alternative.questionRef) confirm = item
            item.disabled = false
        }

        /* setTimeout(() => {
            const elements = document.getElementsByClassName(styles.confirm)
            let confirm
            for (const item of elements) {
                if (item.getAttribute('qref') == alternative.questionRef) confirm = item
                item.disabled = false
            }
            confirm.scrollIntoView({ behavior: "smooth" })
        }, 600) */

    }

    const confirmAlternative = () => {
        const question = findQuestion(currentAlternative.nextQuestion)
        const activeSlide = slides.findIndex(q => q.ref == question.ref)

        sliderConsole('mapcontrols')
        sliderConsole(mapControls)

        // move ifood bag on map
        sliderConsole('open map')
        mapControls.open()
        mapControls.setIsMapAnimating(true)
        setNextQuestion(null)

        alternativeAnimation(question.ref, activeSlide)
    }

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

    const sliderClick = (e) => {
        if (mapControls.isOpen) {
            mapControls.close()
        }
    }

    const textBubble = useRef('textBubble')

    useEffect(() => {
        const elements = document.getElementsByClassName(styles.confirm)
        for (const item of elements) {
            item.setAttribute('disabled', false)
        }
    }, [slidesPositions])

    if (mapControls.isMapAnimating) return <div className={`${styles.slider} ${styles.loading} ${mapControls.isOpen ? styles.mapOpen : styles.mapClosed}`}>
        <i style={{ marginRight: '1rem' }} className="fa-solid fa-circle-notch fa-spin"></i> Carregando...
    </div>

    return (<>
        <div onClick={(e) => sliderClick(e)} className={`${styles.slider} ${mapControls.isOpen ? styles.mapOpen : styles.mapClosed}`}>

            {slides.map((slide, index) => {
                return <div
                    key={slide.id}
                    className={`${styles.slide} ${`moveLeft_${slidesPositions[index]}`}`}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.image}>
                            <img src={'image' in slide && slide.image ? slide.image : '/QuestionSlider/placeholder.png'} />
                        </div>
                        <div className={styles.alternatives}>
                            <div className={styles.bubble}>
                                <div className={styles.text} ref={textBubble}>{slide.text}</div>
                            </div>
                            {buildAlternatives(slide)}
                            <button qref={slide.ref} className={styles.confirm} onClick={() => confirmAlternative()}>Confirmar <i className="fa-solid fa-circle-chevron-right"></i></button>
                        </div>
                    </div>
                </div>
            })
            }
        </div>
    </>)
}