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

    /* useEffect(() => {
        //add question 0
        console.log("🚀 ~ file: Slider.js ~ line 118 ~ slides", slides)

        const flowRef = slides[0].flowRef

        slides.unshift({
            alternatives: [{id: `${flowRef}_Q000-A_A`, ref: `${flowRef}_Q000-A_A`, questionRef: `${flowRef}_Q000`, text: 'SEGUIR', nextQuestion: `${flowRef}_Q001`}],
            flowRef: flowRef,
            id: `${flowRef}_000`,
            isEnd: false,
            isHidden: false,
            ref: `${flowRef}_Q000`,
            text: 'fase 0'
        })
    },[]) */

    useEffect(() => {
        const elements = document.getElementsByClassName(styles.confirm)
        for (const item of elements) {
            item.setAttribute('disabled', false)
        }
    }, [slidesPositions])

    if (mapControls.isMapAnimating) return <div className={`${styles.slider} ${styles.loading} ${mapControls.isOpen ? styles.mapOpen : styles.mapClosed}`}>
        <i style={{ marginRight: '1rem' }} className="fa-solid fa-circle-notch fa-spin"></i> Carregando...
    </div>

    console.log('currentSlide',currentSlide)

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
                                <button qref={slide.ref} className={styles.confirm} onClick={() => confirmAlternative()}><span>Confirmar</span> <i className="fa-solid fa-square-caret-right"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            })
            }
        </div>
    </>)
}