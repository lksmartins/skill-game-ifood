import React, { useState, useEffect } from 'react'
import * as d3 from "d3"
import { motion } from "framer-motion"
import styles from './styles/D3.module.css'
import { isMobile } from 'react-device-detect'
import Image from 'next/image'
import Link from 'next/link'
import Progress from '@components/Progress/Progress'
import Icon from './Icons'

function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        w: 0,
        h: 0,
    });
    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                w: window.innerWidth,
                h: window.innerHeight,
            });
        }
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, [])

    return windowSize;
}

export default function Chart(props) {

    const { controls, resetLocalMap } = props
    
    const size = useWindowSize()
    const parentHeight = size.w / 4.5
    const containerSize = { height: parentHeight, width: size.w - parentHeight }

    //console.log(`numbers`, parentHeight, containerSize)

    return <>
        <div
            id="svg-container"
            style={{ height: size.w / 4.5 }}
            className={`${styles.parent} ${controls.isOpen ? styles.open : styles.closed}`}
        >
            {size.w > 0 && (
                <ChartInner
                    width={containerSize.width}
                    height={containerSize.height}
                    {...props}
                />
            )}
        </div>
    </>
}

const mapTesting = false

function mapConsole(message) {
    if (mapTesting) {
        console.log(message)
    }
}

function ChartInner(props) {

    const { data, progressRef, progress, controls, width, height, playerJourney, updateCurrent, nextQuestion, currentQuestionMarker, svgContainerRef } = props

    const BASE_COLOR = '#DADADA'
    const ACTIVE_BASE_COLOR = '#6DDA36'
    const LINE_COLOR = '#DADADA'
    const MAIN_LINE_COLOR = '#ECB751'
    const [showWarning, setShowWarning] = useState(false)
    const [wasPathAnimated, setWasPathAnimated] = useState([])

    useEffect(() => {

        if (data.find(el => el.current == true).ref.includes(`Q001`) && playerJourney.length < 2) setShowWarning(true)

    }, [data])

    let margin = {
        top: height * .24,
        right: width * .045,
        bottom: height * .24,
        left: width * .045,
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

    const createEndIcon = (questionRef) => {

        if (playerJourney.find(el => el.from == questionRef || el.to == questionRef) == null) return null

        try {
            const pos = { x: data.find(el => el.ref == questionRef).x, y: data.find(el => el.ref == questionRef).y }
            return <Icon questionRef={questionRef} pos={pos} xScale={xScale} yScale={yScale} />
        }
        catch (error) {
            console.log('🔴 err', error.message)
        }

    }

    function mapClick(e) {

        if (controls.isOpen == false) {
            controls.open()
        }
        else {
            if (e.target.hasAttribute('qref')) {
                const targetQuestion = e.target.getAttribute('qref')
                if (playerJourney.find(el => el.to == targetQuestion || el.from == targetQuestion)) {
                    updateCurrent(targetQuestion)
                }
            }
        }
    }

    const fixIconPosition = (position) => {
        return isMobile ? {
            x: position.x - xScale(1.5),
            y: position.y - yScale(2.7)
        } : {
            x: position.x - xScale(.5),
            y: position.y - yScale(2.35)
        }
    }

    const curve = d3.line().curve(d3.curveNatural)

    const createIcon = (currentPosition) => {

        const currentFrom = playerJourney[playerJourney.length - 1]?.from
        const prevPos = data.find(el => el.ref == currentFrom)

        return <motion.g
            initial={{ x: fixIconPosition(prevPos || data[0].x).x, y: fixIconPosition(prevPos || data[0].y).y }}
            animate={{ x: fixIconPosition(currentPosition).x, y: fixIconPosition(currentPosition).y }}
            transition={{ duration: 1.5, delay: 0.01, type: 'spring' }}
            x={fixIconPosition(currentPosition).x}
            y={fixIconPosition(currentPosition).y}
        >
            <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 277.96 316"
                width={isMobile ? xScale(7) : xScale(4)}
                height={isMobile ? yScale(7) : yScale(4)}
            >
                <defs>
                    <clipPath id="clippath">
                        <rect x="4.96" width="273" height="316" fill="none" />
                    </clipPath>
                </defs>
                <g>
                    <path d="M221.96,171.7c2.3-.3,3.9-2.5,3.4-4.8l-16.1-76.6c5.5-3,8.9-9.2,8-15.8l-.7-4.7c-1.1-7.4-7.2-12.8-14.4-13.2l-1.8-8.4c-.4-2-2.4-3.4-4.4-3.1l-13.8,1.8c-8.7-11.3-21.5-24.6-34-29.1-12.9-4.6-19.4,.5-22.1,4-.4,.5-.8,1.1-1.1,1.6-1.5-.8-3-1.4-4.5-2-12.9-4.6-19.4,.5-22.1,4-3.7,4.6-3,11.2,1.9,17.6l11.2,15-23.2,3c-2.1,.3-3.7,2.2-3.5,4.3l7.2,89.2c-1.3-.1-2.6-.2-3.8-.2h0c-11.4-.4-22.3,4.3-29.6,13h0s-22-.7-31.6,12.4c0,0-1,.7,1.8,1.4,2.8,.6,6.6,1.4-.8,5.4-2.8,1.5-5.5,3.6-7.4,6.2-3.4,4.7-8.9,7.1-14.4,8.3-4.3,.9,3.8,6.5,17.5,10.5,0,0,27.1,7.7,40.8,1,8.1,5.8,16.9,5.1,18.5,5.1,.2,0,.9-.1,1.9-.2,.2,6,3.3,14.2,15.8,21.8,2,1.4,4.5,2.9,7.7,4,4.2,1.8,8.1,2.4,11.8,2.2,11.9,.6,29.7-2.4,57.4-13.4,62.2-24.8,61.5-44.4,44.4-60.3ZM143.36,52l-11.6-15.5c-.6-.9-1.9-2.8-2.7-5,7.3,5.2,14.3,12.7,19.9,19.7l-5.6,.8Zm-13.5-27.2c3.4-4.3,9.2-5.1,16.8-2.4,10.7,3.8,21.9,15.1,30.1,25.3l-22.2,2.9c-6.7-8.6-15.8-18.5-25.3-24.7,.1-.4,.3-.7,.6-1.1Zm-27.7,3.7c3.4-4.3,9.2-5.1,16.8-2.4,1.6,.6,3.2,1.3,4.9,2.2-.1,3.5,1.3,7.4,4.2,11.2l10,13.3-20.8,2.7c-.5,.1-1,.2-1.4,.5l-11.8-15.7c-1.2-1.8-5.2-7.7-1.9-11.8Z" fill="#c8002d" />
                    <path d="M123.15,250.47c-1.02,0-2.01-.02-2.99-.07-4.62,.21-9.07-.62-13.6-2.54-3-1.05-5.75-2.48-8.63-4.48-11.27-6.89-15.79-14.5-17.36-20.78-6.2-.14-11.78-1.65-16.62-4.49-15.26,5.39-38.86-1.02-41.65-1.81C11.96,213.29-.25,208.32,0,201.7c.08-2.1,1.47-4.83,5.13-5.59,5.34-1.17,9.18-3.3,11.37-6.34,1.99-2.72,4.43-4.75,6.62-6.2-.65-.73-1.07-1.59-1.25-2.59-.3-1.64,.19-3.32,1.28-4.55,9.17-12.15,26.7-13.89,33.14-14.12,7.8-8.3,18.62-12.97,30.23-13.05l-6.75-83.57c-.45-4.69,2.97-8.96,7.78-9.65l14.78-1.91-6.08-8.15c-6.25-8.17-6.96-17.25-1.82-23.69,2.86-3.68,11.22-11.49,27.71-5.62l.18,.07c.37,.15,.73,.29,1.11,.45,3.67-3.84,11.88-9.29,26.42-4.11,13.98,5.03,27.02,19.14,34.5,28.48l10.98-1.43c4.52-.69,9.03,2.49,9.95,7.08l1.07,4.99c7.83,2.01,13.95,8.6,15.17,16.85l.7,4.7c.98,7.18-1.92,14.29-7.37,18.77l15.41,73.33c.46,2.11,.12,4.34-.94,6.24,6.14,7.09,8.57,14.32,7.21,21.55-2.79,14.9-20.93,28.55-57.12,42.98-23.39,9.29-41.84,13.83-56.26,13.83Zm-3-10.08h.26c13.21,.68,31.81-3.71,55.3-13.04,39.6-15.79,49.58-28.03,50.99-35.53,.95-5.1-1.71-10.48-8.14-16.46l-7.79-7.25,9.48-1.24-16.65-79.19,3.26-1.78c3.84-2.1,6.03-6.41,5.44-10.73l-.69-4.64c-.73-4.91-4.82-8.67-9.73-8.94l-3.81-.21-2.4-11.2-9.51,1.24,.07,.09-33.86,4.42-.12-.15-5.15,.73,.1,.14-27.82,3.61,1.19,1.6-5.08,.66-.64,.48-.27-.36-24.77,3.2,7.6,94.09-5.84-.45c-1.26-.1-2.42-.19-3.42-.19h-.18c-9.99-.34-19.32,3.74-25.59,11.21l-1.56,1.86-2.43-.08c-.16,0-14.09-.3-23.13,6.18,.96,.83,1.71,1.97,1.93,3.56,.68,4.77-4.42,7.53-6.87,8.85-2.41,1.29-4.44,2.98-5.74,4.75-2.27,3.14-5.39,5.67-9.3,7.54,2.49,1.11,5.74,2.34,9.76,3.51,7,1.98,27.4,6.1,37.2,1.31l2.68-1.31,2.43,1.74c6.13,4.39,12.8,4.23,14.99,4.17,.15,0,.29,0,.4,0,.1-.01,.22-.03,.37-.04,.33-.04,.75-.09,1.23-.13l5.31-.53,.18,5.34c.21,6.38,4.85,12.49,13.4,17.69l.27,.18c1.38,.97,3.56,2.37,6.46,3.37l.34,.13c3.23,1.39,6.36,1.98,9.56,1.8h.26Zm-37.21-27.81h0Zm-75.69-6.72h-.03s.02,0,.03,0Zm213.22-37.93s0,0,0,.01h0ZM89.73,64.83v.04s0-.02,0-.04Zm18.41-27.42l9.75,12.97,11.02-1.43-4.84-6.44c-2.7-3.54-4.39-7.27-4.98-10.96-.61-.27-1.23-.52-1.88-.76-5.4-1.92-9.17-1.65-11.12,.82l-.03,.03c-.1,.12-.87,1.32,2.09,5.77Zm88.56,12.64h-.06s.04,0,.06,0Zm-1.23-.8s0,.02,0,.03v-.03Zm-57.75-23.37c7.46,5.96,14.08,13.3,18.99,19.4l10.24-1.34c-7.95-8.68-15.59-14.56-21.97-16.83-2.91-1.03-5.33-1.44-7.26-1.23Z" fill="#fff" />
                </g>
                <g clipPath="url(#clippath)">
                    <g>
                        <path d="M92.16,189.4s-18.5,28.6,3,45.2c7.9,6.1,20,22,82.3-2.9,62.3-24.8,61.6-44.4,44.4-60.3-17.1-15.9-120.3-7.3-123.3,6.8-3,14.2-6.4,11.2-6.4,11.2h0Z" fill="#fbb432" />
                        <path d="M86.86,207.9s-11.6,19.2,19.9,34.4c24.7,11.9,42.1-15.7,40.7-24.9s44.9-43.1,69.4-43.1c0,0,11.4,1.4-4.8-12.6-16.2-14-132.8-3.7-125.2,46.2h0Z" fill="#da932b" />
                        <path d="M160.56,65c-.9,.1-1.8-.3-2.3-1.1-6.7-10.7-23.5-32.5-39.3-38.1-7.6-2.7-13.4-1.9-16.8,2.4-3.3,4.1,.7,10,1.9,11.8l17.7,23.7c.8,1.1,.6,2.6-.5,3.4s-2.6,.6-3.4-.5l-17.7-23.7c-4.8-6.4-5.5-13-1.9-17.6,2.7-3.4,9.2-8.6,22.1-4,17,6.1,34.7,28.9,41.7,40.1,.7,1.1,.4,2.6-.8,3.3,0,.1-.4,.3-.7,.3h0Z" fill="#95283b" />
                        <path d="M221.96,171.4l-90.6,11.9c-2.2,.3-4.3-1.3-4.5-3.5l-13-120.2c-.2-2.2,1.3-4.1,3.4-4.4l78.7-10.3c2.1-.3,4,1.1,4.4,3.1l24.9,118.6c.5,2.3-1,4.5-3.3,4.8h0Z" fill="#f64136" />
                        <path d="M138.36,184.2l-39.3,5.2c-2.3,.3-4.3-1.4-4.5-3.6l-9.8-120.7c-.2-2.2,1.3-4,3.5-4.3l33.4-4.4,16.7,127.8h0Z" fill="#d5293f" />
                        <path d="M188.26,61.4c-.9,.1-1.8-.3-2.3-1.1-6.7-10.7-23.5-32.5-39.3-38.1-7.6-2.7-13.4-1.9-16.8,2.4-3.3,4.1,.7,10,1.9,11.8l17.7,23.7c.8,1.1,.6,2.6-.5,3.4s-2.6,.6-3.4-.5l-17.7-23.7c-4.8-6.4-5.5-13-1.9-17.6,2.7-3.4,9.2-8.6,22.1-4,17,6.1,34.7,28.9,41.7,40.1,.7,1.1,.4,2.6-.8,3.3-.1,.1-.4,.2-.7,.3h0Z" fill="#d5293f" />
                        <path d="M165.06,116.3c-3.5,2.1-7.9,2.4-11.6,.7-4.8-2.2-6.9-6.9-7.7-10.5-.4-1.9-.2-4.3,1.4-5.5,1.6-1.2,3.8-.9,5,.7,0,.1,12.2,7.3,20,2.3,1.7-1.1,6.6,.9-.6,8.1-.6,.7-3.9,2.7-6.5,4.2h0Z" fill="#661b1c" />
                        <path d="M96.06,92.1c-1.3,0-2.6-.9-2.8-2.3-.3-1.6,.7-3.1,2.3-3.4l37-7.7c1.6-.3,3.1,.7,3.4,2.3,.3,1.6-.7,3.1-2.3,3.4l-37,7.7h-.6Z" fill="#661b1c" />
                        <path d="M151.36,84.6c-3.6,0-6.6-2.9-6.7-6.6-.1-3.7,2.9-6.7,6.6-6.8l37.8-.6c3.7,0,6.7,2.9,6.8,6.6s-2.9,6.7-6.6,6.8l-37.8,.6h-.1Z" fill="#661b1c" />
                        <path d="M153.56,61.4l-10.2,1.5c-8.4,1.2-14.2,9-13,17.4l.5,3.3c1.2,8.4,9,14.3,17.4,13.1l10.2-1.5c8.4-1.2,14.2-9,13-17.4l-.5-3.3c-1.2-8.5-9-14.4-17.4-13.1Z" fill="#661b1c" />
                        <path d="M199.16,56.5l-10.2,1.5c-8.4,1.2-14.2,9-13,17.4l.7,4.7c1.2,8.4,9,14.3,17.4,13.1l10.2-1.5c8.4-1.2,14.2-9,13-17.4l-.7-4.7c-1.2-8.4-9-14.3-17.4-13.1Z" fill="#661b1c" />
                        <path d="M145.16,93.6c-.3,0-.6-.1-.8-.3-.6-.5-.6-1.3-.2-1.8l11-13.3-10.9-1.7,10.2-11.7c.5-.5,1.3-.6,1.8-.1s.6,1.3,.1,1.8l-7,8.1,10.8,1.6-14,16.9c-.3,.3-.6,.5-1,.5h0Z" fill="#fff" />
                        <path d="M193.36,89.1c-.3,0-.6-.1-.8-.3-.6-.5-.6-1.3-.2-1.8l11-13.3-10.9-1.6,10.2-11.7c.5-.5,1.3-.6,1.8-.1s.6,1.3,.1,1.8l-7,8.1,10.8,1.6-14,16.9c-.3,.2-.7,.4-1,.4h0Z" fill="#fff" />
                        <path d="M88.16,154.1c-12-.4-23.5,4.9-30.8,14.5-4.8,6.3-8,14.8-4.9,25.4,7.4,25.4,27.9,23.4,30.4,23.4s56.7-9.1,62.6-33.9c4.7-19.7-33.9-28.6-57.3-29.4h0Z" fill="#fbb432" />
                        <path d="M58.56,167.1s-22-.7-31.6,12.4c0,0-1,.7,1.8,1.4,2.8,.6,6.6,1.4-.8,5.4-2.8,1.5-5.5,3.6-7.4,6.2-3.4,4.7-8.9,7.1-14.4,8.3-4.3,.9,3.8,6.5,17.5,10.5,0,0,28.5,8.1,41.8,.5" fill="#ff2928" />
                        <path d="M60.36,179.1s-11-.3-15.8,6.2c0,0-.5,.4,.9,.7s3.3,.7-.4,2.7c-1.4,.8-2.8,1.8-3.7,3.1-1.7,2.4-4.4,3.6-7.2,4.1-2.1,.4,1.9,3.3,8.8,5.3,0,0,14.2,4.1,20.9,.2" fill="#c8002d" />
                    </g>
                </g>
            </svg>
        </motion.g>

    }

    //https://www.essycode.com/posts/d3-animation-along-path/

    const createCurvedLine = ({ color, strokeWidth, points, pathLength, transition = { duration: 2, delay: 0.2, type: 'spring' } }) => {

        return <g><motion.path
            initial={{ pathLength: pathLength[0] }}
            animate={{ pathLength: pathLength[1] }}
            transition={transition}
            d={curve(points)}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none" />

            {/* <line className={`${styles.road}`} x1={points[0][0]} y1={points[0][1]} x2={points[1][0]} y2={points[1][1]} stroke="black" strokeWidth={10}
                stroke-dasharray="4" /> */}
        </g>

    }

    const createNextQuestionCircle = ({ isVisible, x, y }) => {

        return isVisible &&
            <motion.circle fill="white" key={`key_${data[0].ref}_${Math.random()}`}
                initial={{ scale: 0 }}
                animate={{ scale: 2 }}
                transition={{ duration: .6, delay: .1, type: 'tween', repeat: Infinity, repeatType: "mirror" }}

                cx={xScale(x)}
                cy={yScale(y)}
                r="10" />
    }

    const createCurrentCircle = (x = data[0].x, y = data[0].y) => {

        return <motion.circle fill="white" ref={currentQuestionMarker} key={`current_circle_${data[0].ref}_${Math.random()}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, delay: 0.2, type: 'spring' }}

            cx={x}
            cy={y}
            r="10" />
    }

    const isHelper = (ref) => {
        return ref.includes('helper')
    }

    const isVisited = (itemRef) => {
        for (const journeyItem of playerJourney) {
            if (journeyItem.to == itemRef || journeyItem.from == itemRef) return true
        }
        if (itemRef == currentObj.ref) return true
        return false
    }

    const createCircle = (questionRef, isMain, x, y) => {

        const _isHelper = isHelper(questionRef)

        return <g style={{ cursor: 'pointer' }}>
            <circle
                className={_isHelper ? styles.hidden : styles.shadow}
                fill="none"
                stroke="white"
                strokeWidth={5}
                opacity={_isHelper ? 0 : 1}
                cx={xScale(x)}
                cy={yScale(y)}
                r={Math.trunc(height / 20)} />

            <circle
                className={_isHelper ? styles.hidden : ''}
                qref={questionRef}
                fill={isVisited(questionRef) == true ? ACTIVE_BASE_COLOR : BASE_COLOR}
                opacity={_isHelper ? 0 : 1}
                cx={xScale(x)}
                cy={yScale(y)}
                r={Math.trunc(height / 20)} />
        </g>
    }

    const createText = (item) => {

        if (isHelper(item.ref)) return null

        if (item.ref != data.find(el => el.current == true).ref) return null

        const rectW = item.stepName.length * 10
        const rectH = 18
        const rectX = xScale(item.x) - rectW / 2
        const rectY = yScale(item.y) + 25

        return <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: item.ref == data.find(el => el.current == true).ref ? controls.isOpen ? 1 : 0 : 0 }}>
            <defs>
                <filter x="-0.05" y="0.05" width="1.1" height="1" id="solid">
                    <feFlood flood-color="rgba(0,0,0,0.7)" result="bg" />
                    <feMerge>
                        <feMergeNode in="bg" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <text
                id={`text_${item.ref}`}
                qref={item.ref}
                filter="url(#solid)"
                alignmentBaseline="middle"
                fill="white"
                x={rectX + (rectW / 12)}
                y={rectY + 10}
            >{item.stepName != '' ? item.stepName : item.ref}
            </text>
        </motion.g>

    }

    return <>

        <div className={styles.col}>

            <Link href="/"><a><Image src="/ifood-logo.svg" width="200" height="120" objectFit="contain" /></a></Link>
            <Link href="/start">
                <a className={`btn-ifood-light mainRed`}>
                    <i className="fa-solid fa-arrow-rotate-left me-1"></i> Voltar ao inicio
                </a>
            </Link>

            {showWarning &&
                <div className="warning-popup p-2 px-3">
                    <div onClick={() => setShowWarning(false)} className="btn-ifood-light p-0 px-2 w-auto"><i className="fa-solid me-1 fa-circle-xmark"></i> Fechar</div>
                    Você pode clicar nas etapas que já visitou, para seguir novos caminhos, ou revisar o conteúdo.
                </div>
            }

        </div>

        <div ref={svgContainerRef}
            style={{ width: width }}
            className={styles.svgContainer}
            onClick={(e) => mapClick(e)}
        >

            <svg id="svgMap" viewBox={`0 0 ${width} ${height}`}>

                {/* Lines */}
                {data.map((baseItem, index) => {

                    mapConsole('')
                    mapConsole(`baseItem ${baseItem.ref}`)
                    mapConsole(playerJourney)

                    let isThisNextVisible = nextQuestion == baseItem.ref

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
                            mapConsole(baseItem.current == true, isValidPair() == true)

                            let pathLengthStart = 0
                            let pathLength = 0

                            if (baseItem.current == true) {

                                if (isValidPair() == true) {
                                    mapConsole('🟢 🟢')
                                    pathLengthStart = 0
                                    pathLength = 1

                                    if (currentFrom == fromRef) {
                                        mapConsole('🟢 🟢 🟢')
                                        pathLengthStart = 0
                                        pathLength = 1
                                    }
                                    else {
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

                            // was path animated
                            if (baseItem.current == true) {
                                if (wasPathAnimated.find(el => el.to == baseItem.ref && el.from == fromRef)) {
                                    mapConsole('🔵')
                                    pathLengthStart = 1
                                    pathLength = 1
                                }

                                if (pathLengthStart == 0 && pathLength == 1) {
                                    setTimeout(() => {
                                        setWasPathAnimated([...wasPathAnimated, { from: fromRef, to: baseItem.ref }])
                                    }, 1600)
                                }

                            }

                            let transition = { duration: 2, delay: 0.2, type: 'spring' }

                            // if is next
                            if (isThisNextVisible && fromRef == currentObj.ref) {
                                pathLengthStart = 0
                                pathLength = 1
                                transition = { duration: 2, delay: .1, type: 'tween', repeat: Infinity, repeatType: "alternate" }
                            }

                            let lineColor = LINE_COLOR
                            let lineWidth = 6
                            let isMain = false
                            for (const el of data) {
                                if (el.main == true && el.ref == fromRef) isMain = true
                            }

                            if (baseItem.main == true && isMain == true) {
                                lineColor = MAIN_LINE_COLOR
                                lineWidth = 12
                            }

                            /* Lines */
                            return <g key={`lines_${Math.random(0, 10000000)}_${index}`}>

                                {/* Base Roads */}
                                {/* Curved or Straight lines */}
                                {'curve' in baseItem ? createCurvedLine({
                                    points: 'curve' in baseItem ? [[fromX, fromY], [xScale(baseItem.curve[0]), yScale(baseItem.curve[1])], [toX, toY]] : [[fromX, fromY], [toX, toY]],
                                    color: lineColor,
                                    strokeWidth: lineWidth,
                                    pathLength: [1, 1]
                                })
                                    :
                                    <line
                                        x1={fromX}
                                        x2={toX}
                                        y1={fromY}
                                        y2={toY}
                                        stroke={lineColor}
                                        strokeWidth={lineWidth}
                                        strokeOpacity={1}
                                    />}

                                {/* Red Roads */}
                                {createCurvedLine({
                                    points: 'curve' in baseItem ? [[fromX, fromY], [xScale(baseItem.curve[0]), yScale(baseItem.curve[1])], [toX, toY]] : [[fromX, fromY], [toX, toY]],
                                    color: "red",
                                    strokeWidth: lineWidth / 2,
                                    pathLength: [pathLengthStart, pathLength],
                                    transition: transition
                                })}
                            </g>
                        })

                    }

                })}

                {/* Texts, Base circles & nextQuestion circle */}
                {data.map((item, index) => {

                    let isThisNextVisible = nextQuestion == item.ref ? true : false

                    return <g key={`${index}_${item.ref}`}>

                        {createCircle(item.ref, item.main, item.x, item.y)}

                        {createNextQuestionCircle({ isVisible: isThisNextVisible, x: item.x, y: item.y })}

                    </g>
                })}

                {data.map((item) => {
                    return createEndIcon(item.ref)
                })}

                {/* Current circle */}
                {createCurrentCircle(currentPosition.x, currentPosition.y)}

                {/* Icon */}
                {createIcon(currentPosition)}

                {data.map((item, index) => {

                    return <g key={`${index}_${item.ref}_texts`}>

                        {createText(item)}

                    </g>
                })}

            </svg>
        </div>

        <div className={styles.col}>
            <Progress animationRef={progressRef} progress={progress} />
        </div>
    </>
}