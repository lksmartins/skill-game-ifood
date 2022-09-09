import React, { useState, useRef } from 'react'
import styles from './styles/Slider.module.css'
import { isMobile } from 'react-device-detect'

const sliderTesting = false

const sliderConsole = (message)=>{

    if( sliderTesting ){
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
    addToJourney }) {

    const [currentAlternative, setCurrentAlternative] = useState(null)

    const chooseAlternative = (alternative) => {

        setCurrentAlternative(alternative)
        setNextQuestion(alternative.nextQuestion)

        if(isMobile){
            const elements = document.getElementsByClassName(styles.confirm)
            let confirm
            for( const item of elements ) {
                if( item.getAttribute('qref') == alternative.questionRef ) confirm = item
            }
            confirm.scrollIntoView({ behavior: "smooth" })
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

        setTimeout(() => {
            sliderConsole('addToJourney')
            addToJourney(question.ref)

            setTimeout(() => {
                sliderConsole('close map')
                mapControls.close()

                // move slide
                setTimeout(() => {
                    sliderConsole('move slides')
                    mapControls.setIsMapAnimating(false)
                    setCurrentSlide(activeSlide)
                    updateSlidesPositions(moveTo(slides, activeSlide))
                }, 1600)

            }, 1800)

        }, 1250)

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

    const textBubble = useRef('textBubble')

    if (mapControls.isMapAnimating) return <div className={`${styles.slider} ${styles.loading} ${mapControls.isOpen ? styles.mapOpen : styles.mapClosed}`}>
        Carregando...
    </div>

    return (<>
        <div className={`${styles.slider} ${mapControls.isOpen ? styles.mapOpen : styles.mapClosed}`}>

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
                                <div className={styles.text} ref={textBubble}>{slide.ref} - {slide.text}</div>
                                {/* <div className={styles.buttons}>
                                    <i onClick={()=>scrollUp()} className="fa-solid fa-square-caret-up"></i>
                                    <i onClick={()=>scrollDown()} className="fa-solid fa-square-caret-down"></i>
                                </div> */}
                            </div>
                            {buildAlternatives(slide)}
                            <button qref={slide.ref} className={styles.confirm} onClick={() => confirmAlternative()}>Confirmar <i class="fa-solid fa-circle-chevron-right"></i></button>
                        </div>
                    </div>
                </div>
            })
            }
        </div>
    </>)
}