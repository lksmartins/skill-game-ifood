import React, { useState, useEffect } from 'react'
import styles from './styles/sliderMobile.module.css'

const sliderTesting = false

const sliderConsole = (message) => {

    if (sliderTesting) {
        console.log(message)
    }

}

export default function Slider({
    files,
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

        if (!('alternatives' in question)) return
        const alternatives = question.alternatives
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
                    className={`${styles.slide} ${slides[currentSlide].id == slide.id ? styles.showSlide : styles.hideSlide} ${`moveLeft_${slidesPositions[index]}`}`}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.text}>
                            <div className={styles.title}>
                                {slide.text}
                            </div>
                            <div className={styles.alternatives}>
                                {buildAlternatives(slide)}
                                <button qref={slide.ref} className={styles.confirm} onClick={() => confirmAlternative()}>Confirmar <i className="fa-solid fa-circle-chevron-right"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            })
            }
        </div>
    </>)
}