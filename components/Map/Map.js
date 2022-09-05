import React from 'react'
import styles from './styles/Map.module.css'

export default function Map() {

    const gridRows = 8
    const gridCols = 12
    const gridElementsCount = gridRows * gridCols
    const bases = [
        { x: 0, y: 0, ref: 'Q001' },
        { x: 1, y: 1, ref: 'Q002' },
        { x: 2, y: 2, ref: 'Q003' },
        { x: 3, y: 3, ref: 'Q004' },
    ]

    const generateGrid = (cells) => {
        let arr = []
        for (let i = 0; i < cells; i++) {
            let x = i % gridCols
            arr.push({x: x, y: i < gridCols ? 0 : Math.trunc(i / gridCols) })
        }
        return arr
    }
        

    const gridElements = generateGrid(gridElementsCount)

    for (let i = 0; i < gridElementsCount; i++) {

        let {x, y} = gridElements[i]
        let isBase = bases.find(base => base.x == x && base.y == y)
        let toReplace = isBase ? isBase : { x: x, y: y, ref: null }
        gridElements[i] = toReplace

    }

    return (
        <div className={styles.map}>

            <div className={styles.grid}>

                {
                    gridElements.map((item, index) => {
                        return <div key={index} className={`${styles.gridElement} ${item.ref != null && styles.base}`}>{`x: ${item.x}, y: ${item.y}`}</div>
                    })
                }

            </div>

        </div>
    )
}