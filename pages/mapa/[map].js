import React, { useState, useEffect } from 'react'
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
    const [isMapOpen, setIsMapOpen] = useState(false)
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
        { x: 0, y: 5, ref: "Q001", from: [], current: true },
        { x: 5, y: 5, ref: "Q002", from: ['Q001'], current: false },
        { x: 10, y: 0, ref: "Q003", from: ['Q002'], current: false },
        { x: 15, y: 0, ref: "Q004", from: ['Q003'], current: false },
        { x: 15, y: 5, ref: "Q005", from: ['Q003'], current: false },
        { x: 10, y: 15, ref: "Q006", from: ['Q003'], current: false },
        { x: 10, y: 25, ref: "Q007", from: ['Q006', 'Q011'], current: false },
        { x: 15, y: 20, ref: "Q008", from: ['Q007'], current: false },
        { x: 20, y: 15, ref: "Q009", from: ['Q008'], current: false },
        { x: 20, y: 20, ref: "Q010", from: ['Q008'], current: false },
        { x: 20, y: 25, ref: "Q011", from: ['Q008'], current: false },
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
    const [localMap, setLocalMap, resetLocal] = useLocalStorage('map')
    const [localJourney, setLocalJourney] = useLocalStorage('journey')
    const [localMapLoaded, setLocalMapLoaded] = useState(false)
    const [mapData, updateMapData] = useState(usedMap)
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

    const resetLocalInfo = ()=>{
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
            if( localJourney != '' ){
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
            />

        </main>
    )
}