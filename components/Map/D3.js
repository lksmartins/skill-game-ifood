import React from 'react'
import * as d3 from "d3"
import useMeasure from "react-use-measure"
import { motion } from "framer-motion"
import styles from './styles/D3.module.css'

export default function Chart({ data, controls, playerJourney, updateCurrent, nextQuestion }) {

    let [ref, bounds] = useMeasure()

    return <>
        <div className={`${styles.parent} ${controls.isOpen ? styles.open : styles.closed}`} id="svg-container" ref={ref}>
            {bounds.width > 0 && (
                <ChartInner
                    data={data}
                    controls={controls}
                    playerJourney={playerJourney}
                    width={bounds.width}
                    height={bounds.height}
                    updateCurrent={updateCurrent}
                    nextQuestion={nextQuestion}
                />
            )}
        </div>
    </>
}

const mapTesting = false

function mapConsole(message){
    if( mapTesting ){
        console.log( message )
    }
}

function ChartInner({ data, controls, width, height, playerJourney, updateCurrent, nextQuestion }) {

    let margin = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 100,
    }

    let xScale = d3
        .scaleLinear()
        .domain(d3.extent(data.map(d => d.x)))
        .range([margin.left, width - margin.right])

    let yScale = d3
        .scaleLinear()
        .domain(d3.extent(data.map(d => d.y)))
        .range([margin.top, height - margin.bottom])

    let currentObj = data.find(el => el.current == true)
    let currentPosition = { x: xScale(currentObj.x), y: yScale(currentObj.y) }
    let nextObj = data.find(el => el.ref == nextQuestion)
    let nextPosition = nextObj != null ? { x: xScale(nextObj.x), y: yScale(nextObj.y) } : { x: currentPosition.x, y: currentPosition.y }

    const fixIconPosition = (position) => {
        return {
            x: position.x - xScale(.09),
            y: position.y - yScale(.09)
        }
    }

    const hasMultipleFroms = (from) => {
        let found = 0
        for (const item of data) {
            for (const fromItem of item.from) {
                if (fromItem == from) found++
            }
        }
        return found > 1
    }

    return (
        <>
            <svg viewBox={`0 0 ${width} ${height}`}>

                {data.map((baseItem, index) => {

                    mapConsole('')
                    mapConsole(`baseItem ${baseItem.ref}`)
                    mapConsole(playerJourney)

                    if (baseItem.from.length > 0) {

                        return baseItem.from.map(fromRef => {

                            let from = data.find(el => el.ref == fromRef)
                            let fromX = xScale(from.x)
                            let fromY = yScale(from.y)

                            let to = baseItem
                            let toX = xScale(to.x)
                            let toY = yScale(to.y)

                            const currentFrom = playerJourney[playerJourney.length - 1]?.from

                            const isValidPair = () => {
                                for (const journeyItem of playerJourney) {
                                    if (journeyItem.to == baseItem.ref && journeyItem.from == fromRef) return true
                                }
                                return false
                            }

                            mapConsole(fromRef + ' -> ' + baseItem.ref)
                            mapConsole(baseItem.current == true, isValidPair())

                            let pathLengthStart = 0
                            let pathLength = 0

                            if (baseItem.current == true) {

                                if (isValidPair() == true) {
                                    mapConsole('🟢 🟢')
                                    pathLengthStart = 0
                                    pathLength = 1

                                    if( currentFrom == fromRef ){
                                        mapConsole('🟢 🟢 🟢')
                                        pathLengthStart = 0
                                        pathLength = 1
                                    }
                                    else{
                                        mapConsole('🟢 🟢 🔴')
                                        pathLengthStart = 1
                                        pathLength = 1
                                    }
                                }
                                else {
                                    mapConsole('🟢 🔴')
                                    pathLengthStart = 0
                                    pathLength = 0
                                }
                            }
                            else {
                                if (isValidPair() == true) {
                                    mapConsole('🔴 🟢')
                                    pathLengthStart = 1
                                    pathLength = 1
                                }
                                else {

                                    mapConsole('🔴 🔴')
                                    pathLengthStart = 0
                                    pathLength = 0

                                }
                            }

                            /* Lines */
                            return <g key={`lines_${Math.random(0, 10000000)}_${index}`}>

                                {/* Road */}
                                <line
                                    x1={fromX}
                                    x2={toX}
                                    y1={fromY}
                                    y2={toY}
                                    stroke="#6F6C87"
                                    strokeWidth="10"
                                />

                                {/* Red road */}
                                <motion.line
                                    initial={{ pathLength: pathLengthStart }}
                                    animate={{ pathLength: pathLength }}
                                    transition={{ duration: 2, delay: 0.2, type: 'spring' }}

                                    x1={fromX}
                                    x2={toX}
                                    y1={fromY}
                                    y2={toY}
                                    stroke="red"
                                    strokeWidth="10"
                                />
                            </g>
                        })

                    }

                })}

                {/* Texts, Base circles & nextQuestion circle */}
                {data.map((item, index) => {

                    let isThisNextVisible = nextQuestion == item.ref ? true : false

                    return <g key={`${index}_${item.ref}`}>
                        <circle onClick={() => updateCurrent(item.ref)} fill="orange" cx={xScale(item.x)} cy={yScale(item.y)} r="15" />

                        <motion.text
                            initial={{ opacity: 0 }}
                            animate={{ opacity: controls.isOpen ? 1 : 0 }}
                            alignmentBaseline="middle"
                            fill="white"
                            x={xScale(item.x) - 18}
                            y={yScale(item.y) + 30}>
                            {item.ref}
                        </motion.text>

                        {isThisNextVisible &&
                            <motion.circle fill="white" key={`next_${nextPosition}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 2 }}
                                transition={{ duration: .6, delay: 0.1, type: 'tween', repeat: Infinity, repeatType: "mirror" }}

                                cx={xScale(item.x)}
                                cy={yScale(item.y)}
                                r="10" />}
                    </g>
                })}

                {/* Current circle */}
                <motion.circle fill="white" key={currentPosition}
                    initial={{ scale: 0, }}
                    animate={{ scale: 1, cx: currentPosition.x, cy: currentPosition.y }}
                    transition={{ duration: 2, delay: 0.2, type: 'spring' }}

                    cx={xScale(data[0].x)}
                    cy={yScale(data[0].y)}
                    r="10" />

                {/* Icon */}
                <motion.g
                    initial={{ x: fixIconPosition(currentPosition).x, y: fixIconPosition(currentPosition).y }}
                    animate={{ x: fixIconPosition(currentPosition).x, y: fixIconPosition(currentPosition).y }}
                    transition={{ duration: 1.5, delay: 0.01, type: 'spring' }}
                    x={fixIconPosition(currentPosition).x}
                    y={fixIconPosition(currentPosition).y}
                >
                    <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="-136 0 538 202"
                        width={xScale(1.3)}
                        height={yScale(1.3)}
                    >
                        <path d="M77.63,152.48s-16.33,25.14,2.63,39.71c7,5.36,17.67,19.3,72.56-2.5s54.29-39,39.17-53-106-6.43-108.69,6-5.67,9.79-5.67,9.79Z" fill="#fbb432" />
                        <path d="M73,168.76s-10.23,16.88,17.55,30.17c21.8,10.43,37.09-13.82,35.84-21.87s39.6-37.88,61.15-37.88c0,0,10,1.26-4.26-11S66.23,124.9,73,168.76Z" fill="#da932b" />
                        <g id="Layer_1-2" data-name="Layer 1-2">
                            <path d="M137.91,43.22a2.1,2.1,0,0,1-2.06-1c-5.9-9.41-20.72-28.51-34.62-33.45-6.71-2.38-11.82-1.64-14.78,2.13-2.91,3.62.58,8.81,1.71,10.32L103.79,42a2.11,2.11,0,0,1-3.37,2.54L84.79,23.78c-4.26-5.66-4.88-11.45-1.65-15.49,2.38-3,8.09-7.51,19.5-3.48,15,5.33,30.62,25.35,36.78,35.2a2.11,2.11,0,0,1-.66,2.9,2.14,2.14,0,0,1-.85.31Z" fill="#95283b" />
                            <path d="M192,136.73l-79.83,10.46a3.5,3.5,0,0,1-4-3.1L96.72,38.51a3.55,3.55,0,0,1,3-3.87l69.37-9.09A3.51,3.51,0,0,1,173,28.3l22,104.2a3.56,3.56,0,0,1-3,4.23Z" fill="#f64136" />
                            <path d="M118.3,147.91l-34.65,4.54a3.52,3.52,0,0,1-4-3.17l-8.57-106a3.51,3.51,0,0,1,3-3.81l29.42-3.85L118.3,147.91Z" fill="#d5293f" />
                            <path d="M162.31,40a2.11,2.11,0,0,1-2.06-1c-5.89-9.42-20.72-28.52-34.62-33.46C118.92,3.22,113.81,4,110.85,7.72s.58,8.82,1.71,10.32L128.2,38.83a2.11,2.11,0,1,1-3.38,2.54L109.19,20.58c-4.26-5.66-4.88-11.45-1.65-15.48,2.38-3,8.09-7.52,19.5-3.49,15,5.33,30.62,25.35,36.79,35.2a2.11,2.11,0,0,1-.67,2.9,2.14,2.14,0,0,1-.85.31Z" fill="#d5293f" />
                            <path d="M141.85,88.32a11.07,11.07,0,0,1-10.23.6c-4.21-2-6.08-6-6.8-9.2-.39-1.7-.14-3.74,1.25-4.8a3.16,3.16,0,0,1,4.44.62s10.77,6.37,17.6,2c1.47-.94,5.84.75-.55,7.13a59.32,59.32,0,0,1-5.71,3.63Z" fill="#661b1c" />
                        </g>
                        <path d="M81.09,67.05A2.56,2.56,0,0,1,80.57,62l32.63-6.77a2.56,2.56,0,1,1,1,5L81.61,67a2.29,2.29,0,0,1-.52,0Z" fill="#661b1c" />
                        <path d="M129.84,60.48a5.89,5.89,0,0,1-.08-11.77l33.32-.5A5.89,5.89,0,1,1,163.25,60l-33.32.5Z" fill="#661b1c" />
                        <rect x="111.29" y="40.51" width="36.14" height="29.99" rx="13.53" transform="translate(-6.59 18.99) rotate(-8.19)" fill="#661b1c" />
                        <rect x="151.58" y="36.28" width="36.14" height="31.24" rx="13.53" transform="translate(-5.66 24.7) rotate(-8.19)" fill="#661b1c" />
                        <path d="M124.33,68.33a1.11,1.11,0,0,1-.73-.26,1.15,1.15,0,0,1-.15-1.62l9.71-11.67-9.63-1.43,9-10.27a1.15,1.15,0,1,1,1.73,1.51L128,51.69l9.53,1.41L125.22,67.92a1.17,1.17,0,0,1-.89.41Z" fill="#fff" />
                        <path d="M166.77,64.35a1.12,1.12,0,0,1-.73-.27,1.15,1.15,0,0,1-.15-1.62l9.71-11.67L166,49.37l9-10.28a1.14,1.14,0,0,1,1.62-.11,1.16,1.16,0,0,1,.11,1.63l-6.18,7.1,9.52,1.4L167.66,63.93a1.15,1.15,0,0,1-.89.42Z" fill="#fff" />
                        <path d="M74.1,121.46A32.56,32.56,0,0,0,47,134.17c-4.21,5.54-7,13-4.3,22.31C49.18,178.78,67.23,177,69.48,177s49.94-8,55.17-29.81C128.78,130,94.7,122.16,74.1,121.46Z" fill="#fbb432" />
                        <path d="M48,132.89s-19.36-.6-27.88,10.93c0,0-.89.66,1.6,1.22s5.82,1.22-.71,4.75a19.23,19.23,0,0,0-6.54,5.44c-3,4.14-7.82,6.27-12.68,7.25-3.76.75,3.34,5.73,15.41,9.25,0,0,25.1,7.12,36.82.41" fill="#ff2928" />
                        <path d="M49.56,143.41s-9.69-.3-14,5.47c0,0-.45.33.8.61s2.92.61-.35,2.38a9.59,9.59,0,0,0-3.28,2.72,10,10,0,0,1-6.34,3.63c-1.88.37,1.67,2.86,7.71,4.63,0,0,12.56,3.56,18.42.2" fill="#c8002d" />
                    </svg>
                </motion.g>


            </svg>
        </>
    )
}