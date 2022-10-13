import React, { useState, useEffect, useRef } from 'react'
import { getToken } from '../../lib/helper'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import getFilesFromDir from '@lib/getFilesFromDir'
import { isMobile } from 'react-device-detect'
import styles from './play.module.css'
import Link from 'next/link'

import Map from '../../components/Map/D3'
import MapMobile from '../../components/Map/D3mobile'
import Slider from '../../components/QuestionSlider/Slider'
import SliderMobile from '../../components/QuestionSlider/SliderMobile'

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

export default function Play({ questions, map, files, ends }) {

    const [isLoading, setIsLoading] = useState(true)

    // Progress
    const [progress, setProgress] = useState(50)
    const progressRef = useRef()

    // MAP
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
        { x: 0, y: 15.5, ref: 'F001_Q000', from: [], current: true, main: true, isNext: false, isEnd: false },
        { x: 1, y: 25.5, ref: 'F001_Q001', from: ['F001_Q000'], current: false, main: true, isNext: false, isEnd: false },
        { x: 4, y: 5, ref: 'F001_Q002', from: ['F001_Q001'], current: false, main: false, isNext: false, isEnd: false },
        { x: 11.5, y: 0, ref: 'F001_Q003', from: ['F001_Q002'], current: false, main: false, isNext: false, isEnd: true },
        { x: 9, y: 10, ref: 'F001_Q004', from: ['F001_Q002'], current: false, main: false, isNext: false, isEnd: true },
        { x: 3.5, y: 20, ref: 'F001_Q005', from: ['F001_Q002'], current: false, main: false, isNext: false, isEnd: true },
        { x: 7, y: 35, ref: 'F001_Q006', from: ['F001_Q001', 'F001_Q005'], current: false, main: true, isNext: false, isEnd: false },
        { x: 12, y: 20, ref: 'F001_Q007', from: ['F001_Q006'], current: false, main: false, isNext: false, isEnd: false },
        { x: 14.8, y: 8, ref: 'F001_Q008', from: ['F001_Q007'], current: false, main: false, isNext: false, isEnd: true },
        { x: 16.9, y: 14, ref: 'F001_Q009', from: ['F001_Q007'], current: false, main: false, isNext: false, isEnd: true },
        { x: 16, y: 24.7, ref: 'F001_Q010', from: ['F001_Q007'], current: false, main: false, isNext: false, isEnd: true },
        { x: 19.06, y: 35, ref: 'F001_Q011', from: ['F001_Q006', 'F001_Q010'], current: false, main: true, isNext: false, isEnd: false },
        { x: 25.05, y: 35, ref: 'F001_Q012', from: ['F001_Q011', 'F001_Q024'], current: false, main: true, isNext: false, isEnd: false },
        { x: 33.5, y: 15, curve: [30, 25], ref: 'F001_Q013', from: ['F001_Q012'], current: false, main: false, isNext: false, isEnd: false },
        { x: 31, y: 3, ref: 'F001_Q014', from: ['F001_Q013'], current: false, main: false, isNext: false, isEnd: true },
        { x: 33.5, y: 30, ref: 'F001_Q015', from: ['F001_Q013'], current: false, main: false, isNext: false, isEnd: true },
        { x: 38.5, y: 29.3, ref: 'F001_Q016', from: ['F001_Q013'], current: false, main: false, isNext: false, isEnd: false },
        { x: 41.5, y: 10, ref: 'F001_Q017', from: ['F001_Q016'], current: false, main: false, isNext: false, isEnd: false },
        { x: 47, y: 2, curve: [43.5, 2], ref: 'F001_Q018', from: ['F001_Q017'], current: false, main: false, isNext: false, isEnd: true },
        { x: 50, y: 17.3, curve: [46, 9], ref: 'F001_Q019', from: ['F001_Q017'], current: false, main: false, isNext: false, isEnd: true },
        { x: 47.5, y: 35, curve: [43, 35], ref: 'F001_Q020', from: ['F001_Q016'], current: false, main: false, isNext: false, isEnd: true },
        { x: 20.9, y: 10, ref: 'F001_Q021', from: ['F001_Q011'], current: false, main: false, isNext: false, isEnd: false },
        { x: 23.5, y: 0, ref: 'F001_Q022', from: ['F001_Q021'], current: false, main: false, isNext: false, isEnd: true },
        { x: 26.5, y: 5, ref: 'F001_Q023', from: ['F001_Q021'], current: false, main: false, isNext: false, isEnd: true },
        { x: 23.1, y: 21.5, ref: 'F001_Q024', from: ['F001_Q021'], current: false, main: false, isNext: false, isEnd: true },
        { x: 30, y: 35, ref: 'F001_Q121', from: ['F001_Q012'], current: false, main: true, isNext: false, isEnd: true },

        { x: 0, y: 0, ref: "helper0", from: [], current: false, main: false, isNext: false, isEnd: false },
        { x: 50, y: 35, ref: "helper1", from: [], current: false, main: false, isNext: false, isEnd: false },
    ]

    const mapDataset2 = [
        { x: 0, y: 15.5, ref: 'F002_Q000', from: [], current: true, main: true, isNext: false, isEnd: false },
        { x: 0, y: 25.5, ref: 'F002_Q001', from: ['F002_Q000'], current: false, main: true, isNext: false, isEnd: false },
        { x: 4, y: 5, ref: 'F002_Q002', from: ['F002_Q001'], current: false, main: false, isNext: false, isEnd: false },
        { x: 11.5, y: 0, ref: 'F002_Q003', from: ['F002_Q002'], current: false, main: false, isNext: false, isEnd: true },
        { x: 9, y: 10, ref: 'F002_Q004', from: ['F002_Q002'], current: false, main: false, isNext: false, isEnd: true },
        { x: 3.5, y: 20, ref: 'F002_Q005', from: ['F002_Q002'], current: false, main: false, isNext: false, isEnd: true },
        { x: 7, y: 35, ref: 'F002_Q006', from: ['F002_Q001', 'F002_Q005'], current: false, main: true, isNext: false, isEnd: false },
        { x: 14, y: 20, ref: 'F002_Q007', from: ['F002_Q006'], current: false, main: false, isNext: false, isEnd: true },
        { x: 19.06, y: 35, ref: 'F002_Q008', from: ['F002_Q006'], current: false, main: true, isNext: false, isEnd: false },
        { x: 27, y: 35, ref: 'F002_Q009', from: ['F002_Q008'], current: false, main: true, isNext: false, isEnd: true },
        { x: 23, y: 20, ref: 'F002_Q010', from: ['F002_Q008'], current: false, main: false, isNext: false, isEnd: false },
        { x: 22, y: 1, ref: 'F002_Q011', from: ['F002_Q010'], current: false, main: false, isNext: false, isEnd: true },
        { x: 27, y: 1, ref: 'F002_Q012', from: ['F002_Q010'], current: false, main: false, isNext: false, isEnd: true },
        { x: 31, y: 29, ref: 'F002_Q013', from: ['F002_Q010'], current: false, main: false, isNext: false, isEnd: false },
        { x: 34, y: 6, ref: 'F002_Q014', from: ['F002_Q013'], current: false, main: false, isNext: false, isEnd: true },
        { x: 38.5, y: 29, ref: 'F002_Q015', from: ['F002_Q013'], current: false, main: false, isNext: false, isEnd: false },
        { x: 45, y: 6, curve: [42, 13.5], ref: 'F002_Q016', from: ['F002_Q015'], current: false, main: false, isNext: false, isEnd: true },
        { x: 48, y: 30, curve: [44, 35], ref: 'F002_Q017', from: ['F002_Q015'], current: false, main: false, isNext: false, isEnd: true },

        { x: 0, y: 0, ref: "helper0", from: [], current: false, main: false, isNext: false, isEnd: false },
        { x: 50, y: 35, ref: "helper1", from: [], current: false, main: false, isNext: false, isEnd: false },
    ]

    const feedMapData = (food, map) => {
        
        for (const item of food) {
            for (const mapItem of map) {
                if (mapItem.ref == item.ref) mapItem.stepName = item.stepName
            }
        }

        return map

    }

    const [mapData, updateMapData] = useState(map == 'F001' ? feedMapData(questions, mapDataset1) : feedMapData(questions, mapDataset2))
    //const [mapData, updateMapData] = useState()
    const [isMapOpen, setIsMapOpen] = useState(false)
    const [localMap, setLocalMap, resetLocal] = useLocalStorage(`map_${map}`)
    const [localJourney, setLocalJourney] = useLocalStorage(`journey_${map}`)
    const [localMapLoaded, setLocalMapLoaded] = useState(false)
    const [playerJourney, updatePlayerJourney] = useState([])

    const mapControlsObj = {
        ...mapControls,
        isOpen: isMapOpen,
        isMapAnimating: isMapAnimating,
        setIsMapAnimating: (bool) => setIsMapAnimating(bool)
    }

    const updateCurrent = (ref) => {

        console.log('🟢 updateCurrent', ref)

        let from = playerJourney[playerJourney.length - 1]
        from = from == null ? mapData[0].ref : from.to
        const newData = [...mapData]

        for (var i = 0; i < mapData.length; i++) {
            newData[i].current = false
            if (newData[i].ref == ref) newData[i].current = true
        }

        updateMapData(newData)
        const lastPJ = playerJourney[playerJourney.length - 1]
        const newPJ = { from: from, to: ref }
        if (lastPJ != newPJ) updatePlayerJourney([...playerJourney, newPJ])
    }

    const resetLocalInfo = () => {
        resetLocal('map')
        resetLocal('journey')
    }

    const isLocalMapCompatible = (map, localMap) => {

        let compatibles = []

        for (const item of map) {

            let found = false

            for (const localItem of localMap) {
                if (localItem.ref == item.ref) {
                    found = true
                }
            }

            if (localMap.filter(el => el.isEnd == true).length < 9) found = false

            if (found == true) {
                compatibles.push(item)
            }

        }

        //console.log("🚀 compatibles.length == localMap.length", compatibles.length == localMap.length)
        return compatibles.length == localMap.length

    }

    const updataMapDataFromLocalStorage = (local) => {

        const newData = [...mapData]

        let i = 0
        for (const item of local) {
            newData[i].current = item.current
            i++
        }

        updateMapData(newData)

    }

    useEffect(() => {

        //console.log('useEffect[]')

        if (localMapLoaded == true) return

        setLocalMapLoaded(true)

        //Map
        if (localMap == '') {
            setLocalMap(mapData)
            return
        }

        if (!isLocalMapCompatible(mapData, localMap)) {
            setLocalMap(mapData)
            return
        }

        let found = false
        localMap.map(item => {
            if (item.current == true) {
                updateCurrent(item.ref)
                found = true
            }
        })
        if (found == false) localMap[0].current = true

        updataMapDataFromLocalStorage(localMap)

        //Journey
        if (localJourney != '') {
            updatePlayerJourney(localJourney)
        }

    }, [])

    useEffect(() => {
        if (localMapLoaded == true) {
            //console.log('useEffect[mapData]', mapData)
            setLocalMap(mapData)
        }
    }, [mapData])

    const getUniquePJ = (data) => {
        const uniques = []
        for (const item of data) {
            const found = uniques.find(el => el.to == item.to && el.from == item.from)
            if (found == null) uniques.push(item)
        }
        return uniques
    }

    useEffect(() => {

        //console.log('useEffect[playerJourney]', playerJourney)
        let lastPlayerJourney = playerJourney[playerJourney.length - 1]
        if (lastPlayerJourney != null) {
            updateActiveSlide(lastPlayerJourney.to)
        }

        if (localMapLoaded == true) {
            setLocalJourney(playerJourney)
        }

        // update progress
        const totalEnds = mapData.filter(el => el.isEnd == true)
        //console.log("🚀 ~ file: [map].js ~ line 270 ~ useEffect ~ totalEnds", totalEnds)

        let count = 0
        for (const end of totalEnds) {
            const found = getUniquePJ(playerJourney).find(el => el.from == end.ref || el.to == end.ref)
            if (found != null) count++
        }

        const percent = count == 0 ? 0 : Math.trunc((count * 100) / totalEnds.length)

        if (percent != progress) setProgress(percent)

        if (lastPlayerJourney != null) {
            if (lastPlayerJourney.to == 'F001_Q001' || lastPlayerJourney.to == 'F002_Q001') {
                window.gtag('event', 'user_started_game', {
                    'event_label': 'user_started_game',
                    'value': { flow: map, time: Date.now() }
                })
            }
        }

    }, [playerJourney])

    useEffect(() => {

        if (progressRef.current != null) {

            progressRef.current.classList.add('animate1')

            setTimeout(() => {
                progressRef.current.classList.remove('animate1')
                progressRef.current.classList.add('animate2')

                setTimeout(() => {
                    progressRef.current.classList.remove('animate2')
                }, [300])
            }, [300])

            //GA event
            if (progress == 100) {
                window.gtag('event', 'user_completed_flow', {
                    'event_label': 'user_completed_flow',
                    'value': map
                })
                window.gtag('event', 'user_completed_game', {
                    'event_label': 'user_completed_game',
                    'value': { flow: map, time: Date.now() }
                })
            }
        }

    }, [progress])

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
                setCurrentSlide(activeSlide)
                updateSlidesPositions(moveTo(questions, activeSlide))

                // move slide
                setTimeout(() => {
                    setIsMapAnimating(false)
                }, 600)

            }, 1000)

        }, 600)
    }

    //isMobile
    useEffect(() => {

        setIsLoading(false)

    }, [isMobile])

    return (
        <main className={`${styles.mapPage} container-fluid d-flex flex-column p-0 m-0`}>

            {
                isLoading ? <div className="w-100 p-5 fs-1 text-center"><i class="fa-solid fa-spin fa-spinner"></i></div> : (

                    isMobile ? <MapMobile
                        data={mapData}
                        controls={mapControlsObj}
                        playerJourney={playerJourney}
                        updatePlayerJourney={updatePlayerJourney}
                        updateCurrent={updateCurrent}
                        nextQuestion={nextQuestion}
                        resetLocalMap={resetLocalInfo}
                        currentQuestionMarker={currentQuestionMarker}
                        svgContainerRef={svgContainer}
                        progress={progress}
                        progressRef={progressRef}
                    />
                        :
                        <Map
                            data={mapData}
                            controls={mapControlsObj}
                            playerJourney={playerJourney}
                            updatePlayerJourney={updatePlayerJourney}
                            updateCurrent={updateCurrent}
                            nextQuestion={nextQuestion}
                            resetLocalMap={resetLocalInfo}
                            currentQuestionMarker={currentQuestionMarker}
                            svgContainerRef={svgContainer}
                            progress={progress}
                            progressRef={progressRef}
                        />
                )
            }
            {
                isLoading ? null : (
                    isMobile ? <>
                        <div style={{marginTop: '-2.25rem', marginBottom:'0.25rem', padding:'0 0.65rem', zIndex: 30}}>
                            <Link href="/">
                                <a
                                className={`btn-ifood`}
                                style={{padding: '0.35rem'}}
                                >
                                    <i className="fa-solid fa-arrow-rotate-left me-1"></i> Voltar a tela inicial
                                </a>
                            </Link>
                        </div>
                        <SliderMobile
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
                        /></> :
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
                )}


        </main>
    )
}