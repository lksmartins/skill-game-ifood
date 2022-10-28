// https://svg2jsx.com/

import React from 'react'

export default function Icon({ questionRef, pos, xScale, yScale }) {

    try {
        let callType = questionRef

        // to use the same icon
        switch (questionRef) {
            case 'F001_Q003':
                callType = 'F002_Q003'
                break
            case 'F001_Q004':
                callType = 'F002_Q004'
                break
            case 'F001_Q009':
                callType = 'F002_Q004'
                break
            case 'F001_Q014':
                callType = 'F002_Q014'
                break
            case 'F001_Q015':
                callType = 'F002_Q012'
                break
            case 'F001_Q018':
                callType = 'F002_Q016'
                break
            case 'F001_Q020':
                callType = 'F002_Q017'
                break
            case 'F001_Q022':
                callType = 'F002_Q003'
                break
            case 'F001_Q022':
                callType = 'F002_Q012'
                break
            case 'F001_Q023':
                callType = 'F002_Q012'
                break
            case 'F001_Q121':
                callType = 'F002_Q009'
                break
            
            case 'F002_Q011':
                callType = 'F002_Q003'
                break

            default:
                callType = questionRef
        }

        let calc = { x: xScale(pos.x * 25), y: yScale(pos.y == 0 ? 180 : pos.y * 30) }
        let scale = 0.05

        switch (questionRef) {
            case 'F001_Q008':
                calc = { x: xScale(pos.x * 24.7), y: yScale(pos.y * 37.5) }
                scale = 0.05
                break;
            case 'F001_Q009':
                calc = { x: xScale(pos.x * 28.7), y: yScale(pos.y * 37.5) }
                scale = 0.04
                break;
            case 'F001_Q121':
                calc = { x: xScale(pos.x * 22.2), y: yScale(pos.y * 29.5) }
                scale = 0.05
                break;
            case 'F001_Q022':
                calc = { x: xScale(pos.x * 23.8), y: yScale(8 * 30.5) }
                scale = 0.04
                break;
            case 'F001_Q023':
                calc = { x: xScale(pos.x * 35.8), y: yScale(pos.y * 64.5) }
                scale = 0.03
                break;
            case 'F001_Q014':
                calc = { x: xScale(pos.x * 27.8), y: yScale(270) }
                scale = 0.04
                break;
            case 'F001_Q015':
                calc = { x: xScale(pos.x * 36.6), y: yScale(1600) }
                scale = 0.03
                break;
            case 'F001_Q018':
                calc = { x: xScale(pos.x * 35.9), y: yScale(370) }
                scale = 0.03
                break;
            case 'F001_Q019':
                calc = { x: xScale(pos.x * 35.4), y: yScale(970) }
                scale = 0.03
                break;
            case 'F001_Q020':
                calc = { x: xScale(pos.x * 35.7), y: yScale(pos.y * 46.5) }
                scale = 0.03
                break;

            case 'F002_Q009':
                calc = { x: xScale(pos.x * 18.7), y: yScale(pos.y * 23.5) }
                scale = 0.06
                break;
            case 'F002_Q011':
                calc = { x: xScale(pos.x * 22.7), y: yScale(220) }
                scale = 0.05
                break;
            case 'F002_Q012':
                calc = { x: xScale(pos.x * 37.7), y: yScale(420) }
                scale = 0.03
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
        //console.log(`does not exist`)
    }

}