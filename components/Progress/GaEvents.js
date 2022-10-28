import React, { useEffect } from 'react'
import { useLocalStorage } from '@hooks/useLocalStorage'

export default function GaEvents({ progress }) {

    const [localGaEvents, setLocalGaEvents] = useLocalStorage('app_ga_events')

    const marks = [1, 25, 50, 75]
    const eventCounter = []
    eventCounter[1] = isLocalSet ? 0 : localGaEvents[1]
    eventCounter[25] = isLocalSet ? 25 : localGaEvents[25]
    eventCounter[50] = isLocalSet ? 50 : localGaEvents[50]
    eventCounter[75] = isLocalSet ? 75 : localGaEvents[75]

    const isLocalSet = ()=>{
        return localGaEvents == null || localGaEvents == ''
    }

    const loopLogic = (item) => {

        if (progress >= item && eventCounter[item] == 0) {

            //console.log('DISPARA GA EVENT PERCENT', item, progress)
            const eventName = `user_percent_${item}_${progress}`
            window.gtag('event', eventName, {
                'event_label': eventName,
                'value': { time: Date.now() }
            })
            eventCounter[item]++

            setLocalGaEvents(eventCounter)

        }
        
    }

    useEffect(() => {

        marks.map(item => loopLogic(item))

    }, [progress])

    return null
}