import * as d3 from "d3"
import useMeasure from "react-use-measure"
import { motion } from "framer-motion"
import styles from './styles/D3.module.css'

export default function Chart(data) {

    let [ref, bounds] = useMeasure()

    return (
        <div className={styles.parent} ref={ref}>
            {bounds.width > 0 && (
                <ChartInner data={data} width={bounds.width} height={bounds.height} />
            )}
        </div>
    );
}

function ChartInner({ data, width, height }) {

    const dummyData = [
        { x: 0, y: 10, ref: "Q001", to: "Q002" },
        { x: 10, y: 25, ref: "Q002", to: "Q003" },
        { x: 20, y: 30, ref: "Q003", to: "Q004" },
        { x: 30, y: 10, ref: "Q004", to: "" },
    ]

    let margin = {
        top: 20,
        right: 50,
        bottom: 120,
        left: 50,
    }

    let xScale = d3
        .scaleLinear()
        .domain(d3.extent(dummyData.map(d => d.x)))
        .range([margin.left, width - margin.right])

    let yScale = d3
        .scaleLinear()
        .domain(d3.extent(dummyData.map(d => d.y)))
        .range([height - margin.bottom, margin.top])

    let line = d3
        .line()
        .x((d) => xScale(d.x))
        .y((d) => yScale(d.y))

    let d = line(dummyData)

    return (
        <>
            <svg className="" viewBox={`0 0 ${width} ${height}`}>
                <motion.path
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    d={d} 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="10" />

                {dummyData.map((item, index) => {

                    let to = item.to != '' ? dummyData.find(el=>el.ref==item.to) : null
                    let x2 = to != null ? xScale(to.x) : xScale(item.x)
                    let y2 = to != null ? yScale(to.y) : yScale(item.y)

                    return <g key={index}>
                        <motion.line
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{duration: 1.5, delay: 0.3 * index}}

                            x1={xScale(item.x)}
                            x2={x2}
                            y1={yScale(item.y)}
                            y2={y2}
                            stroke="red"
                            strokeWidth="10"
                        />
                        <text 
                            alignmentBaseline="middle" 
                            fill="white" 
                            x={xScale(item.x)-18} 
                            y={yScale(item.y)+30}>
                                {item.ref}
                        </text>
                        <circle fill="orange" cx={xScale(item.x)} cy={yScale(item.y)} r="15" />
                    </g>
                })}
            </svg>
        </>
    )
}