import React, { useState, useEffect, useRef } from 'react'
import { getToken } from '../../lib/helper'
import Map from '../../components/Map/D3'
import Slider from '../../components/QuestionSlider/Slider'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import getFilesFromDir from '@lib/getFilesFromDir'
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
            map: flowRef,
            files: getFilesFromDir('QuestionSlider')
        }
    }

}

export default function Play({ questions, map, files }) {

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
        { x: 0, y: 25.5, ref: "F001_Q001", from: [], current: true, main: true, isNext: false },
        { x: 4, y: 5, ref: "F001_Q002", from: ['F001_Q001'], current: false, main: false, isNext: false },
        { x: 11.5, y: 0, ref: "F001_Q003", from: ['F001_Q002'], current: false, main: false, isNext: false },
        { x: 9, y: 10, ref: "F001_Q004", from: ['F001_Q002'], current: false, main: false, isNext: false },
        { x: 3.5, y: 20, ref: "F001_Q005", from: ['F001_Q002'], current: false, main: false, isNext: false },
        { x: 7, y: 35, ref: "F001_Q006", from: ['F001_Q001', 'F001_Q005'], current: false, main: true, isNext: false },
        { x: 12, y: 20, ref: "F001_Q007", from: ['F001_Q006'], current: false, main: false, isNext: false },
        { x: 14.8, y: 8, ref: "F001_Q008", from: ['F001_Q007'], current: false, main: false, isNext: false },
        { x: 16.9, y: 14, ref: "F001_Q009", from: ['F001_Q007'], current: false, main: false, isNext: false },
        { x: 16, y: 24.7, ref: "F001_Q010", from: ['F001_Q007'], current: false, main: false, isNext: false },
        { x: 19.06, y: 35, ref: "F001_Q011", from: ['F001_Q006', 'F001_Q010'], current: false, main: true, isNext: false },
        { x: 25.05, y: 31.8, ref: "F001_Q012", from: ['F001_Q011', 'F001_Q024'], current: false, main: true, isNext: false },
        { x: 33.2, y: 15, curve: [30, 25], ref: "F001_Q013", from: ['F001_Q012'], current: false, main: false, isNext: false },
        { x: 33.1, y: 3, ref: "F001_Q014", from: ['F001_Q013'], current: false, main: false, isNext: false },
        { x: 33.5, y: 30, ref: "F001_Q015", from: ['F001_Q013'], current: false, main: false, isNext: false },
        { x: 38.5, y: 29.3, ref: "F001_Q016", from: ['F001_Q013'], current: false, main: false, isNext: false },
        { x: 41.5, y: 10, ref: "F001_Q017", from: ['F001_Q016'], current: false, main: false, isNext: false },
        { x: 47, y: 2, curve: [43.5, 2], ref: "F001_Q018", from: ['F001_Q017'], current: false, main: false, isNext: false },
        { x: 50, y: 17.3, curve: [46, 9], ref: "F001_Q019", from: ['F001_Q017'], current: false, main: false, isNext: false },
        { x: 47.5, y: 35, curve: [43,35], ref: "F001_Q020", from: ['F001_Q016'], current: false, main: false, isNext: false },
        { x: 22.5, y: 10, ref: "F001_Q021", from: ['F001_Q011'], current: false, main: false, isNext: false },
        { x: 21.5, y: 0, ref: "F001_Q022", from: ['F001_Q021'], current: false, main: false, isNext: false },
        { x: 26.5, y: 5, ref: "F001_Q023", from: ['F001_Q021'], current: false, main: false, isNext: false },
        { x: 23.5, y: 21.5, ref: "F001_Q024", from: ['F001_Q021'], current: false, main: false, isNext: false },
        { x: 30, y: 33, ref: "F001_Q121", from: ['F001_Q012'], current: false, main: true, isNext: false },

        { x: 0, y: 0, ref: "helper0", from: [], current: false, main: false, isNext: false },
        { x: 50, y: 35, ref: "helper1", from: [], current: false, main: false, isNext: false },
    ]

    const mapDataset2 = [
        { x: 0, y: 25.5, ref: "F002_Q001", from: [], current: true, main: true, isNext: false },
        { x: 4, y: 5, ref: "F002_Q002", from: ['F002_Q001'], current: false, main: false, isNext: false },
        { x: 11.5, y: 0, ref: "F002_Q003", from: ['F002_Q002'], current: false, main: false, isNext: false },
        { x: 9, y: 10, ref: "F002_Q004", from: ['F002_Q002'], current: false, main: false, isNext: false },
        { x: 3.5, y: 20, ref: "F002_Q005", from: ['F002_Q002'], current: false, main: false, isNext: false },
        { x: 7, y: 35, ref: "F002_Q006", from: ['F002_Q001', 'F002_Q005'], current: false, main: true, isNext: false },
        { x: 12, y: 20, ref: "F002_Q007", from: ['F002_Q006'], current: false, main: false, isNext: false },
        { x: 14.8, y: 8, ref: "F002_Q008", from: ['F002_Q007'], current: false, main: false, isNext: false },
        { x: 16.9, y: 14, ref: "F002_Q009", from: ['F002_Q007'], current: false, main: false, isNext: false },
        { x: 16, y: 24.7, ref: "F002_Q010", from: ['F002_Q007'], current: false, main: false, isNext: false },
        { x: 18.8, y: 35, ref: "F002_Q011", from: ['F002_Q006', 'F002_Q010'], current: false, main: true, isNext: false },
        { x: 25.05, y: 31.8, ref: "F002_Q012", from: ['F002_Q011', 'F002_Q024'], current: false, main: true, isNext: false },
        { x: 33.2, y: 15, curve: [30, 25], ref: "F002_Q013", from: ['F002_Q012'], current: false, main: false, isNext: false },
        { x: 33.1, y: 3, ref: "F002_Q014", from: ['F002_Q013'], current: false, main: false, isNext: false },
        { x: 33.5, y: 30, ref: "F002_Q015", from: ['F002_Q013'], current: false, main: false, isNext: false },
        { x: 38.7, y: 29.5, ref: "F002_Q016", from: ['F002_Q013'], current: false, main: false, isNext: false },
        { x: 41.5, y: 10, ref: "F002_Q017", from: ['F002_Q016'], current: false, main: false, isNext: false },
        { x: 47, y: 2, curve: [43.5, 2], ref: "F002_Q018", from: ['F002_Q017'], current: false, main: false, isNext: false },
        { x: 50, y: 17.3, curve: [46, 9], ref: "F002_Q019", from: ['F002_Q017'], current: false, main: false, isNext: false },
        { x: 47.5, y: 35, curve: [43,35], ref: "F002_Q020", from: ['F002_Q016'], current: false, main: false, isNext: false },
        { x: 22.5, y: 10, ref: "F002_Q021", from: ['F002_Q011'], current: false, main: false, isNext: false },
        { x: 21.5, y: 0, ref: "F002_Q022", from: ['F002_Q021'], current: false, main: false, isNext: false },
        { x: 26.5, y: 5, ref: "F002_Q023", from: ['F002_Q021'], current: false, main: false, isNext: false },
        { x: 23.5, y: 21.5, ref: "F002_Q024", from: ['F002_Q021'], current: false, main: false, isNext: false },
        { x: 30, y: 33, ref: "F002_Q121", from: ['F002_Q012'], current: false, main: true, isNext: false },

        { x: 0, y: 0, ref: "helper0", from: [], current: false, main: false, isNext: false },
        { x: 50, y: 35, ref: "helper1", from: [], current: false, main: false, isNext: false },
    ]

    const [mapData, updateMapData] = useState(map=='F001' ? mapDataset1 : mapDataset2)
    //const [mapData, updateMapData] = useState()
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

        /* if (localMapLoaded == false) {

            //Map
            if (localMap == '') {
                setLocalMap(mapData)
            }
            else {
                let found = false
                localMap.map(item => {
                    if (item.current == true){
                        updateCurrent(item.ref)
                    }
                })
                if( found == false ) localMap[0].current = true
                updateMapData(localMap)
                setLocalMapLoaded(true)
            }

            //Journey
            if (localJourney != '') {
                updatePlayerJourney(localJourney)
            }

        } */

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
            />

            <Slider
                files={files}
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