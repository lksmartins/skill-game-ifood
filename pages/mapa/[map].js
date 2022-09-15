import React, { useState, useEffect, useRef } from 'react'
import { getToken } from '../../lib/helper'
import Map from '../../components/Map/D3'
import Slider from '../../components/QuestionSlider/Slider'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import styles from './play.module.css'

export async function getStaticPaths() {
    return {
        paths: [
            '/mapa/faco-minhas-entregas',
            '/mapa/uso-entregas-ifood'
        ],
        fallback: false, // can also be true or 'blocking'
    }
}

export async function getStaticProps(context) {
    console.log("🚀 ~ file: [map].js ~ line 19 ~ getStaticProps ~ context", context)

    const jwt = await getToken()

    const { map } = context.params
    const flowRef = map == 'faco-minhas-entregas' ? 'F001' : 'F002'

    const res = await fetch(`${process.env.API_URL}/flow/${flowRef}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': jwt
        }
    })

    const data = await res.json()

    return {
        props: {
            questions: data,
            map: map
        }
    }

}

export default function Play({ questions, map }) {

    // MAP
    const [isMapOpen, setIsMapOpen] = useState(true)
    const [isMapAnimating, setIsMapAnimating] = useState(false)

    const toggleMapOpen = () => {
        setIsMapOpen(prev => !prev)
    }

    const mapControls = {
        open: () => setIsMapOpen(true),
        close: () => setIsMapOpen(false)
    }

    const [nextQuestion, setNextQuestion] = useState('')

    const mapDataset1 = [
        { x: 0, y: 25.5, ref: "Q001", from: [], current: true, main: true, isNext: false },
        { x: 4, y: 5, ref: "Q002", from: ['Q001'], current: false, main: false, isNext: false },
        { x: 11.5, y: 0, ref: "Q003", from: ['Q002'], current: false, main: false, isNext: false },
        { x: 9, y: 10, ref: "Q004", from: ['Q002'], current: false, main: false, isNext: false },
        { x: 3.5, y: 20, ref: "Q005", from: ['Q002'], current: false, main: false, isNext: false },
        { x: 7, y: 32, ref: "Q006", from: ['Q001', 'Q005'], current: false, main: true, isNext: false },
        { x: 12, y: 20, ref: "Q007", from: ['Q006'], current: false, main: false, isNext: false },
        { x: 14.8, y: 8, ref: "Q008", from: ['Q007'], current: false, main: false, isNext: false },
        { x: 16.9, y: 14, ref: "Q009", from: ['Q007'], current: false, main: false, isNext: false },
        { x: 16, y: 24.7, ref: "Q010", from: ['Q007'], current: false, main: false, isNext: false },
        { x: 18.85, y: 31.5, ref: "Q011", from: ['Q006', 'Q010'], current: false, main: true, isNext: false },
        { x: 25.05, y: 31.8, ref: "Q012", from: ['Q011', 'Q024'], current: false, main: true, isNext: false },
        { x: 33.2, y: 15, curve: [30, 25], ref: "Q013", from: ['Q012'], current: false, main: false, isNext: false },
        { x: 33.1, y: 3, ref: "Q014", from: ['Q013'], current: false, main: false, isNext: false },
        { x: 33.5, y: 30, ref: "Q015", from: ['Q013'], current: false, main: false, isNext: false },
        { x: 38.7, y: 26.5, ref: "Q016", from: ['Q013'], current: false, main: false, isNext: false },
        { x: 41.5, y: 10, ref: "Q017", from: ['Q016'], current: false, main: false, isNext: false },
        { x: 47, y: 2, curve: [43.5, 2], ref: "Q018", from: ['Q017'], current: false, main: false, isNext: false },
        { x: 50, y: 17.3, curve: [46, 9], ref: "Q019", from: ['Q017'], current: false, main: false, isNext: false },
        { x: 47.5, y: 35, ref: "Q020", from: ['Q016'], current: false, main: false, isNext: false },
        { x: 22.5, y: 10, ref: "Q021", from: ['Q011'], current: false, main: false, isNext: false },
        { x: 21.5, y: 0, ref: "Q022", from: ['Q021'], current: false, main: false, isNext: false },
        { x: 26.5, y: 5, ref: "Q023", from: ['Q021'], current: false, main: false, isNext: false },
        { x: 23.5, y: 21.5, ref: "Q024", from: ['Q021'], current: false, main: false, isNext: false },
        { x: 30, y: 33, ref: "Q0121", from: ['Q012'], current: false, main: true, isNext: false },
    ]

    const mapDataset2 = [
        { x: 0, y: 5, ref: "Q001", from: [], current: true },
        { x: 5, y: 5, ref: "Q002", from: ['Q001'], current: false },
        { x: 10, y: 0, ref: "Q003", from: ['Q002'], current: false },
        { x: 15, y: 0, ref: "Q004", from: ['Q003'], current: false },
        { x: 15, y: 5, ref: "Q005", from: ['Q003'], current: false },
        { x: 10, y: 15, ref: "Q006", from: ['Q003'], current: false },
        { x: 10, y: 25, ref: "Q007", from: ['Q006'], current: false },
        { x: 15, y: 20, ref: "Q008", from: ['Q007'], current: false },
        { x: 20, y: 20, ref: "Q010", from: ['Q008'], current: false },
    ]

    let usedMap = map == 'faco-minhas-entregas' ? mapDataset1 : mapDataset2
    const [mapData, updateMapData] = useState(usedMap)
    const [localMap, setLocalMap, resetLocal] = useLocalStorage('map')
    const [localJourney, setLocalJourney] = useLocalStorage('journey')
    const [localMapLoaded, setLocalMapLoaded] = useState(false)
    const [playerJourney, updatePlayerJourney] = useState([])

    const mapControlsObj = {
        ...mapControls,
        isOpen: isMapOpen,
        isMapAnimating: isMapAnimating,
        setIsMapAnimating: (bool) => setIsMapAnimating(bool)
    }

    const updateCurrent = (ref) => {

        let from = playerJourney[playerJourney.length - 1]
        from = from == null ? mapData[0].ref : from.to
        const newData = [...mapData]

        for (var i = 0; i < mapData.length; i++) {
            newData[i].current = false
            if (newData[i].ref == ref) newData[i].current = true
        }

        updateMapData(newData)
        updatePlayerJourney([...playerJourney, { from: from, to: ref }])
    }

    const resetLocalInfo = () => {
        resetLocal('map')
        resetLocal('journey')
    }

    useEffect(() => {

        if (localMapLoaded == false) {

            //Map
            if (localMap == '') {
                setLocalMap(mapData)
            }
            else {
                updateMapData(localMap)
                localMap.map(item => {
                    if (item.current == true) updateCurrent(item.ref)
                })
                setLocalMapLoaded(true)
            }

            //Journey
            if (localJourney != '') {
                updatePlayerJourney(localJourney)
            }

        }

    }, [])

    useEffect(() => {
        if (localMapLoaded == true) {
            setLocalMap(mapData)
        }
    }, [mapData])

    useEffect(() => {

        let lastPlayerJourney = playerJourney[playerJourney.length - 1]
        if (lastPlayerJourney != null) {
            updateActiveSlide(lastPlayerJourney.to)
        }

        if (localMapLoaded == true) {
            setLocalJourney(playerJourney)
        }

    }, [playerJourney])

    const currentQuestionMarker = useRef()
    const svgContainer = useRef()

    let height
    if (typeof window !== "undefined") {
        height = (window.innerHeight - (window.innerHeight * 0.50)) || 600
    }

    // SLIDER
    const updateActiveSlide = (activeSlideRef) => {
        const activeSlideIndex = questions.findIndex(el => el.ref == activeSlideRef)
        updateSlidesPositions(moveTo(questions, activeSlideIndex))
        setCurrentSlide(activeSlideIndex)

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

    const [slidesPositions, updateSlidesPositions] = useState(moveTo(questions, 0))
    const [currentSlide, setCurrentSlide] = useState(0)

    const alternativeAnimation = (questionRef, activeSlide) => {

        setTimeout(() => {
            updateCurrent(questionRef)

            setTimeout(() => {
                mapControls.close()

                // move slide
                setTimeout(() => {
                    setIsMapAnimating(false)
                    setCurrentSlide(activeSlide)
                    updateSlidesPositions(moveTo(questions, activeSlide))
                }, 1200)

            }, 1800)

        }, 600)
    }

    return (
        <main className={styles.mapPage}>

            <Map
                data={mapData}
                updateData={updateMapData}
                controls={mapControlsObj}
                playerJourney={playerJourney}
                updatePlayerJourney={updatePlayerJourney}
                updateCurrent={updateCurrent}
                nextQuestion={nextQuestion}
                resetLocalMap={resetLocalInfo}
                currentQuestionMarker={currentQuestionMarker}
                svgContainerRef={svgContainer}
                height={height}
            />

            <Slider
                slides={questions}
                moveTo={moveTo}
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
                slidesPositions={slidesPositions}
                updateSlidesPositions={updateSlidesPositions}
                mapControls={mapControlsObj}
                setNextQuestion={setNextQuestion}
                addToJourney={updateCurrent}
                toggleMapOpen={toggleMapOpen}
                alternativeAnimation={alternativeAnimation}
            />

        </main>
    )
}