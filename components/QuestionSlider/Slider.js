import React, { useState, useEffect } from 'react'
import Animation from './Animation'
import styles from './styles/newSlider.module.css'

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
    const [confirmDisabled, setConfirmDisabled] = useState(true)

    const chooseAlternative = (alternative) => {

        setCurrentAlternative(alternative)
        setNextQuestion(alternative.nextQuestion)

        setConfirmDisabled(false)
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
                        return <button
                            key={alternative.id}
                            className={`btn-ifood ${styles.alternative} ${currentAlternative?.ref == alternative.ref && styles.selected}`}
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
        setConfirmDisabled(true)
    }, [currentSlide])

    if (mapControls.isMapAnimating) return <div className={`${styles.slider} ${styles.loading} ${mapControls.isOpen ? styles.mapOpen : styles.mapClosed}`}>
        <i style={{ marginRight: '1rem' }} className="fa-solid fa-circle-notch fa-spin"></i> Carregando...
    </div>

    return (<>
        <div onClick={(e) => sliderClick(e)} className={`${styles.slider} ${mapControls.isOpen ? styles.mapOpen : styles.mapClosed}`}>

            {slides.map((slide, index) => {

                const fileName = `anima_${slide.ref}.json`
                const found = files.find(file => file == fileName)
                const image = found ? <Animation file={`/QuestionSlider/${found}`}/> : <img src="/QuestionSlider/placeholder.png" />

                return <div
                    key={slide.id}
                    className={`${styles.slide} ${slides[currentSlide].id == slide.id ? styles.showSlide : styles.hideSlide} ${`moveLeft_${slidesPositions[index]}`}`}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.image}>
                            {image}
                        </div>
                        <div className={styles.text}>
                            <div className={styles.title}>
                                {slide.text}
                            </div>
                            <div className={styles.alternatives}>
                                {buildAlternatives(slide)}
                                <button 
                                    qref={slide.ref} 
                                    disabled={confirmDisabled}
                                    className={`btn-ifood-light ${styles.confirm}`} 
                                    onClick={() => confirmAlternative()}>
                                        <span>Confirmar</span> <i className="fa-solid fa-square-caret-right"></i>
                                    </button>
                            </div>
                        </div>
                    </div>
                </div>
            })
            }
        </div>
    </>)
}