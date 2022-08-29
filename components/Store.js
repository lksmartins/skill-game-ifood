import React, {useState} from 'react'
import styles from '../styles/Store.module.css'
import Modal from './Modal'
import useSound from 'use-sound'
import Button from './Button'

export default function Store(props){

    const defaultImg = 'https://opengameart.org/sites/default/files/styles/medium/public/Capture_3.PNG'
    const user = props.user
    const wallet = props.wallet

    const storeItems = props.storeItems
    const [modalShow, setModalShow] = useState(false)
    const [currentItem, setCurrentItem] = useState({name:'Item Name', description:'Nome do Item', price:'1.000'})

    const [confirmPurchaseButtonState, setConfirmPurchaseButtonState] = useState('Confirmar')
    const [confirmPurchaseButtonsDisabledState, setConfirmPurchaseButtonsDisabledState] = useState('')
    const [buttonDisabled, setButtonDisabled] = useState('disabled')
    const [panelClass, setPanelClass] = useState(styles.frame+' '+styles.disabled)

	const [modalSound] = useSound('https://branching-stories.s3.amazonaws.com/audio/modal-v1.mp3')
    const [clickSound] = useSound('https://branching-stories.s3.amazonaws.com/audio/click-v1.mp3', {volume:0.6})
    
    function selectItem(item){
        clickSound()
        setCurrentItem(item)
        setButtonDisabled(null)
        setPanelClass(styles.frame+' '+styles.animateFrame)
        setTimeout(() => {
            setPanelClass(styles.frame)
        }, 500)// time for animation to be done
    }

    function confirmPurchase(){
        setModalShow(true)
        modalSound()
    }

    async function buyItem(){

        setConfirmPurchaseButtonState(<i className="fas fa-spin fa-spinner"></i>)
        setConfirmPurchaseButtonsDisabledState('disabled')
        if( props.setAlternativesLoading ){
            props.setAlternativesLoading(true)
        }
        
        const res = await fetch( process.env.API_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                token: process.env.API_KEY, 
                action: 'buyStoreItem',
                user: user.id,
                item: currentItem.id
            })
        })
    
        const data = await res.json()

        console.log('buy item res', data.data)

        props.changeStore(data.data.store)
        props.changeInventory(data.data.inventory)

        setConfirmPurchaseButtonState('Confirmar')

        setModalShow(false)
        props.changeStoreModal(false)

    }

    const fallback = Object.keys(storeItems).length > 0 ? '' : <p>Nenhum item disponível no momento</p>

    currentItem.price = currentItem.price

    return(<div>

        <div className={styles.store}>

            <div className={styles.items}>

                {storeItems?.map((item)=>{
                    let isSelected = currentItem.id == item.id ? styles.selected : ''
                    return(
                        <div className={styles.item+' '+isSelected} key={item.id} onClick={()=>selectItem(item)}>
                            <img src={item.image ? item.image : defaultImg}/>
                            <h3>{item.description}</h3>
                        </div>
                    )
                })}

                {fallback}

            </div>

            <div className={styles.sidebar}>
                
                <div className={panelClass}>
                    <div className={styles.title}>{currentItem.description}</div>
                    <div className={styles.price}>{currentItem.price}PZ$</div>
                </div>

                <div className={styles.wallet}>
                    Carteira: {wallet?.money} PZ$
                </div>

                <button 
                className={styles.button}
                disabled={buttonDisabled}
                onClick={()=>confirmPurchase()}
                ></button>

            </div>

        </div>

        <Modal 
            show={modalShow}
            onHide={()=>setModalShow(false)}
            title="Confirmação"
            footer={<>
                <Button 
                    disabled={confirmPurchaseButtonsDisabledState}
                    onClick={()=>setModalShow(false)} 
                    className="btn btn-default">Fechar</Button>

                <Button 
                    disabled={confirmPurchaseButtonsDisabledState}
                    onClick={()=>buyItem()} 
                    className="btn btn-primary btn-modal">{confirmPurchaseButtonState}</Button>
            </>}
            >
            <p>Você tem certeza que deseja comprar <span className={styles.itemHighlight}>{currentItem.description}</span> por <span className={styles.itemHighlight}>{currentItem.price}PZ$</span>?</p>
        </Modal>

    </div>)

}