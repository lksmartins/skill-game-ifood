// https://svg2jsx.com/

import React from 'react'

export default function Icon({ questionRef, pos, xScale, yScale }) {

    try {
        let callType = questionRef

        switch (questionRef) {
            case 'F002_Q011':
                callType = 'F002_Q003'
                break

            case 'F002_Q012':
                callType = 'F002_Q004'
                break

            default:
                callType = questionRef
        }

        let calc = { x: xScale(pos.x * 25), y: yScale(pos.y == 0 ? 180 : pos.y * 30) }
        let scale = 0.05

        switch (questionRef) {
            case 'F002_Q009':
                calc = { x: xScale(pos.x * 18.7), y: yScale(pos.y * 23.5) }
                scale = 0.06
                break;
            case 'F002_Q011':
                calc = { x: xScale(pos.x * 22.7), y: yScale(220) }
                scale = 0.05
                break;
            case 'F002_Q012':
                calc = { x: xScale(pos.x * 21.9), y: yScale(120) }
                scale = 0.05
                break;
            case 'F002_Q014':
                calc = { x: xScale(pos.x * 21.9), y: yScale(280) }
                scale = 0.05
                break;
            case 'F002_Q016':
                calc = { x: xScale(pos.x * 27.1), y: yScale(370) }
                scale = 0.04
                break;
            case 'F002_Q017':
                calc = { x: xScale(pos.x * 35.7), y: yScale(pos.y * 46.5) }
                scale = 0.03
                break;
        }

        const TheIcon = require(`./icons/${callType}`).default
        return <g 
            x={pos.x} 
            y={pos.y} 
            style={{ transform: `scale(${scale}) translateX(${calc.x}px) translateY(${calc.y}px)` }}
            >
                {<TheIcon/>}
            </g>
    }
    catch (error) {
        console.log(`does not exist`)
    }

}