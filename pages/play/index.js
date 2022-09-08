import React, { useState } from 'react'
import { getToken } from '../../lib/helper'
import styles from './play.module.css'
import Map from '../../components/Map/D3'
import Slider from '../../components/QuestionSlider/Slider'
import { map } from 'd3'

export async function getServerSideProps() {

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
            questions: data
        }
    }

}

export default function Play({questions}) {    

    const [isMapOpen, setIsMapOpen] = useState(true)
    const [isMapAnimating, setIsMapAnimating] = useState(false)

    const toggleMapOpen = ()=>{
        setIsMapOpen(prev=>!prev)
    }

    const mapControls = {
        open: ()=>setIsMapOpen(true),
        close: ()=>setIsMapOpen(false)
    }
    
    const [nextQuestion, setNextQuestion] = useState('')

    const [mapData, updateMapData] = useState([
        { x: 0, y: 5, ref: "Q001", from: [], current: true },
        { x: 5, y: 5, ref: "Q002", from: ['Q001'], current: false },
        { x: 10, y: 0, ref: "Q003", from: ['Q002'], current: false },
        { x: 15, y: 0, ref: "Q004", from: ['Q003'], current: false },
        { x: 15, y: 5, ref: "Q005", from: ['Q003'], current: false },
        { x: 10, y: 15, ref: "Q006", from: ['Q003'], current: false },
        { x: 10, y: 25, ref: "Q007", from: ['Q006','Q011'], current: false },
        { x: 15, y: 20, ref: "Q008", from: ['Q007'], current: false },
        { x: 20, y: 15, ref: "Q009", from: ['Q008'], current: false },
        { x: 20, y: 20, ref: "Q010", from: ['Q008'], current: false },
        { x: 20, y: 25, ref: "Q011", from: ['Q008'], current: false },
    ])

    const [playerJourney, updatePlayerJourney] = useState([])

    const updateCurrent = (ref)=>{

        let from = playerJourney[playerJourney.length-1]
        from = from == null ? mapData[0].ref : from.to
        const newData = [...mapData]

        for (var i = 0; i < mapData.length; i++) {
            newData[i].current = false
            if (newData[i].ref == ref) newData[i].current = true
        }

        updateMapData(newData)
        updatePlayerJourney([...playerJourney, {from:from, to:ref}])
    }

    const mapControlsObj = {
        ...mapControls, 
        isOpen: isMapOpen, 
        isMapAnimating: isMapAnimating, 
        setIsMapAnimating: (bool)=>setIsMapAnimating(bool)
    }

    return (
        <main>

            <button style={{position:'absolute', bottom:'100px', left:'0', zIndex: 30}} onClick={()=>toggleMapOpen()}>{isMapOpen?'CLOSE':'OPEN'}</button>

            <Map
                data={mapData} 
                updateData={updateMapData} 
                controls={mapControlsObj}
                playerJourney={playerJourney}
                updatePlayerJourney={updatePlayerJourney}
                updateCurrent={updateCurrent}
                nextQuestion={nextQuestion}
            />

            <Slider 
                slides={questions} 
                controls={true}
                mapControls={mapControlsObj}
                setNextQuestion={setNextQuestion}
                addToJourney={updateCurrent}
                toggleMapOpen={toggleMapOpen}
            />

        </main>
    )
}