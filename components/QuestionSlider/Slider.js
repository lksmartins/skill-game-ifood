import React, {useState} from 'react'
import styles from './styles/Slider.module.css'

export default function Slider(props) {

    const {slides, controls} = props
    const [currentSlide, setCurrentSlide] = useState(0)
    const [playerJourney, setPlayerJourney] = useState([slides[0]])

    const chooseAlternative = (alternative) => {

        const question = findQuestion(alternative.nextQuestion)

        setPlayerJourney([...playerJourney, question])

        const activeSlide = slides.findIndex(q=>q.ref == question.ref)

        setCurrentSlide(activeSlide)
        updateSlidesPositions(moveTo(slides, activeSlide))

    }

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

    return (<>
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

        {controls && <div className={styles.controls}>
            <button onClick={()=>prevSlide()}>PREV</button>
            <button onClick={()=>nextSlide()}>NEXT</button>
        </div>}
    </>)
}