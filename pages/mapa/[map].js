import React, { useState, useEffect, useRef } from 'react'
import { getToken } from '../../lib/helper'
import Map from '../../components/Map/D3'
import Slider from '../../components/QuestionSlider/Slider'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export async function getServerSideProps(context) {

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
            questions: data,
            map: context.query.map
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
        { x: 0, y: 15.5, ref: "Q001", from: [], current: true },
        { x: 6.1, y: 7, ref: "Q002", from: ['Q001'], current: false },
        { x: 11.5, y: 0, ref: "Q003", from: ['Q002'], current: false },
        { x: 9.5, y: 13.5, ref: "Q004", from: ['Q002'], current: false },
        { x: 6.4, y: 20.5, ref: "Q005", from: ['Q002'], current: false },
        { x: 7, y: 40, ref: "Q006", from: ['Q001', 'Q005'], current: false },
        { x: 12.3, y: 27, ref: "Q007", from: ['Q006'], current: false },
        { x: 14.5, y: 8, ref: "Q008", from: ['Q007'], current: false },
        { x: 16.9, y: 14, ref: "Q009", from: ['Q007'], current: false },
        { x: 17, y: 24.7, ref: "Q010", from: ['Q007'], current: false },
        { x: 22.5, y: 28, ref: "Q011", from: ['Q006'], current: false },
        { x: 30.05, y: 34, ref: "Q012", from: ['Q011'], current: false },
        { x: 26.05, y: 14, ref: "Q013", from: ['Q011'], current: false },
        { x: 25.7, y: 0, ref: "Q014", from: ['Q013'], current: false },
        { x: 32.6, y: 0, ref: "Q015", from: ['Q013'], current: false },
        { x: 37.5, y: 31, ref: "Q016", from: ['Q013'], current: false },
        { x: 43.5, y: 11, ref: "Q017", from: ['Q016'], current: false },
        { x: 50, y: 1, ref: "Q018", from: ['Q017'], current: false },
        { x: 49, y: 17.3, ref: "Q019", from: ['Q017'], current: false },
        { x: 47.5, y: 35, ref: "Q020", from: ['Q016'], current: false },
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

    useEffect(() => {

        const target = currentQuestionMarker.current
        if (target != null) {
            if (isMapOpen == false) {
                setTimeout(() => {
                    const targetY = target.getAttribute('cy')
                    console.log("🚀 target", target, targetY)
                    svgContainer.current.style.top = `-${targetY - 140}px`
                }, 1000)
            } else {
                svgContainer.current.style.top = 0
            }
        }

    }, [isMapOpen])

    let height 
    if (typeof window !== "undefined") {
        height = (window.innerHeight - (window.innerHeight * 0.335)) || 600
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
                }, 1600)

            }, 1800)

        }, 1300)
    }

    return (
        <main>

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