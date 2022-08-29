import React, {useState} from 'react'
import styles from '../styles/Inventory.module.css'

export default function Inventory(props){

    const defaultImg = 'https://opengameart.org/sites/default/files/styles/medium/public/Capture_3.PNG'
    const user = props.user
    const items = props.items

    Object.size = function(obj) {
        var size = 0,
          key;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
    
    const itemPlaceholder = Object.size(items) == 0 ? 'Nenhum item no inventário' : null
    const inventoryClass = itemPlaceholder == null ? '' : 'noGrid'

    return(<div>

        <div className={styles.inventory+' '+inventoryClass}>
            {itemPlaceholder}
            {
            items?.map(item=>
                <div className={styles.item} key={item.id}>
                    <img src={item.image ? item.image : defaultImg}/>
                    <h3>{item.description}</h3>
                </div>
            )
            }

        </div>

    </div>)

}