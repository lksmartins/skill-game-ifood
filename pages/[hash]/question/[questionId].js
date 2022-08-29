import React, { useState, useEffect } from 'react'
import { useSession, getSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import styles from '../../../styles/Group.module.css'
import Button from '../../../components/Button'
import Popup from '../../../components/Popup'
import PlayerFrame from '../../../components/PlayerFrame'
import PanelFrame from '../../../components/PanelFrame'
import HtmlParser from 'react-html-parser'

export async function getServerSideProps(context) {

    const session = await getSession(context)
    const hash = context.query.hash
    const questionId = context.query.questionId

    if( !session ){
        return {
            props: {
                groupData: null,
                hash: hash,
                questionId: questionId
            }
        }
    }

	const res = await fetch( process.env.API_URL, {
		method: 'POST',
		body: JSON.stringify({ 
			token: process.env.API_KEY, 
			action: 'getQuestion',
            hash: hash,
            user: session.user.email,
            question: questionId
		})
	})

	const group_data = await res.json()

    //console.log(group_data)
	
	return {
		props: {
			groupData: group_data.data,
            hash: hash,
            questionId: questionId
		}
	}
}

export default function Fase( props ) {

    // check login
    const [ session, loading ] = useSession()
    if( !session && !loading ) {
        signIn()
    }

    //console.log(props.groupData)

    const router = useRouter()
    const hash = props.hash
    const questionId = props.questionId
    const faseId = 1
    const [groupData, setGroupData] = useState(props.groupData)
    
    const fases = groupData?.fases // used to build map
    const user = groupData?.user
    const profileTeam = user?.profile_team_id
    const wallet = groupData?.wallet
    const question = groupData?.question
    const alternatives = groupData?.alternatives

    const [watingResponse, setWatingResponse] = useState(false)
    const [storeItems, setStoreItems] = useState(groupData?.store)
    const [inventoryItems, setInventoryItems] = useState(groupData?.inventory)
    const [storeModalShow, setStoreModalShow] = useState(false)
    const [alternativeState, setAlternativeState] = useState(null)
    const [confirmState, setConfirmState] = useState('disabled')
    const confirmDefaultText = 'Confirmar'
    const [confirmText, setConfirmText] = useState(confirmDefaultText)

    async function getUserState(){

        const res = await fetch( process.env.API_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                token: process.env.API_KEY, 
                action: 'getQuestion',
                hash: hash,
                user: user.email,
                question: questionId
            })
        })
    
        const group_data = await res.json()
    
        //console.log(group_data)

        setWatingResponse(false)
        
        setGroupData(group_data.data)
        setConfirmText(confirmDefaultText)
        setConfirmState('disabled')
        deselectAllAlternatives()

    }

    function deselectAllAlternatives(){
        const btns = document.getElementsByClassName('alternative-btn')
        for( let btn of btns ){
            btn.classList.remove("active")
        }
    }

    function selectAlternative( id ){

        if( watingResponse ) return

        const btns = document.getElementsByClassName('alternative-btn')
        for( let btn of btns ){
            btn.classList.remove("active")
        }

        document.getElementById(`alternative_${id}`).classList.add("active")
        setAlternativeState(id)
        setConfirmState('')
    
    }

    async function saveUserAnswer( alternative ){

        return true

    }
    
    async function confirmAlternative(){

        setWatingResponse(true)
        setConfirmText(<i className="fas fa-spin fa-spinner"></i>)
        setConfirmState('disabled')

        const alternativeId = alternativeState
        let choosenAlternative = {}

        // getting alternative object
        for( let alternative of alternatives ){
            if( alternative.id == alternativeId ){
                choosenAlternative = alternative
            }
        }

        console.log(choosenAlternative)

        // check if needs item
        let requestedItem = choosenAlternative.requestedStoreItem
        if( requestedItem != 0 ){
            //check if has item
            let hasItem = false
            inventoryItems.map((item)=>{
                if( item.id == requestedItem ){
                    hasItem = true
                }
            })
            if( hasItem == false ){
                openPopup('Precisa de item e não tem no inventário')
                return
            }
        }

        if( choosenAlternative.feedback != '' && choosenAlternative.feedback != null ){
            openPopup(choosenAlternative.feedback)
        }

        if( question.fase_final == 1 && choosenAlternative.final == 1 ){
            if( choosenAlternative.feedback != '' && choosenAlternative.feedback != null ){
                openPopup(choosenAlternative.feedback, ()=>router.push(`/${hash}/fase/${faseId}/review`) )
            }
            else{
                router.push(`/${hash}/fase/${faseId}/review`)
            }
            
        }
        else{
            //router.reload()
            getUserState()
        }

    }

    useEffect(() => {

        setWatingResponse(true)
        setConfirmText(<i className="fas fa-spin fa-spinner"></i>)
        setConfirmState('disabled')

        getUserState()

    }, [inventoryItems])

    const teamClass = 'teamOne'
    const titleClass = styles.teamOne

    const imageId = parseInt(question?.id) < 10 ? `0${question?.id}` : question?.id
    const image = `https://branching-stories.s3.amazonaws.com/enunciados/enunciado_${imageId}.png`
    const missionTitleBg = `https://branching-stories.s3.amazonaws.com/missioTitle0${faseId}.png`

    // popup
    const [popupToggle, setPopupToggle] = useState(false)
    const [popupContent, setPopupContent] = useState('')
    const [popupAction, setPopupAction] = useState('close')

    function openPopup(content, action=null){
        setPopupContent(content)

        if( action != null ){
            setPopupAction(action)
        }

        setPopupToggle(true)
    }

    const avatarGender = user?.avatar == 1 ? 'female' : 'male'

    function changeLojaStr(Element){

        return Element

    }

    function transform(node) {
        if (node.type === 'tag' && node.name === 'span') {
            return <div className="spanLoja">loja</div>
        }
    }

	return (<div className={teamClass}>

        <Popup
            toggle={popupToggle}
            setToggle={setPopupToggle}
            content={popupContent}
            action={popupAction}
        />

        <div className={styles.container}>

            <div className={styles.main}>

                <div className={styles.image}>
                    <img src={image}/>
                </div>

                <div className={styles.content}>
                    
                    <div className={styles.title}>
                        <h4>{question?.id}: { HtmlParser( changeLojaStr(question?.question), { transform: transform }) }</h4>
                    </div>

                    <div className={styles.alternatives}>{
                        alternatives?.map(item=>{

                            let itemDisabled = null
                            let allowStoreCheck = true
                            let alternativeClassEl = ''
                            let lockedByItem = false
                            let lockedByItemText = 'Você precisa de um item da loja para selecionar essa alternativa.'

                            if( item.id > 8 && item.id < 17 && question?.id == 3){
                                itemDisabled = 'disabled'
                                allowStoreCheck = false
                                inventoryItems.map(inventoryItem=>{
                                    if( inventoryItem.id == 2 ){
                                        itemDisabled = null
                                        allowStoreCheck = true
                                    }
                                })
                            }

                            if( parseInt(item.id) == 38){
                                itemDisabled = 'disabled'
                                allowStoreCheck = false
                                lockedByItem = true
                                lockedByItemText = 'Você precisa de alguns itens da loja para selecionar essa alternativa. Limpeza Vorbes Emergencial e todos Remédios.'
                                
                                let countItems = 0
                                inventoryItems.map(inventoryItem=>{
                                    if( [9,19,20,21,22].includes( parseInt(inventoryItem.id) ) ){ // limpeza de vorbes e remedios - missao 2      
                                        countItems++
                                    }
                                })

                                // todos os itens no inventario
                                if( countItems == 5 ){
                                    itemDisabled = null
                                    allowStoreCheck = true
                                }
                            }

                            if( item.requestedStoreItem != 0 && allowStoreCheck==true ){
                                itemDisabled = 'disabled'
                                inventoryItems.map(inventoryItem=>{
                                    if( inventoryItem.id == item.requestedStoreItem ){
                                        itemDisabled = null
                                    }
                                })
                            }
                            // if alternative has already been answered
                            // removed

                            // mission 3 - geometry figures
                            if( question.id == 24 ){
                                if( [69,70,71,72].includes( parseInt(item.id) ) ){

                                    console.log('geometric figures')

                                    if( !item.alternative.includes('<img') ){

                                        let type = typeof item.alternative
                                        console.log(typeof item.alternative, item.alternative)
                                        
                                        if( type == 'string' ){
                                            console.log('SUBSTITUIR')
                                            let replaced = '<img src="https://branching-stories.s3.amazonaws.com/missao3/'+item.alternative+'.png"/>'
                                            item.alternative = replaced
                                            console.log(replaced)
                                        }
                                    }

                                }
                            }
                            // loja
                            if( typeof item.alternative == 'string' ){
                                if( item.alternative.includes(' loja') ){
                                    let replaced = item.alternative.replace(' loja', ' <span>loja</span>')
                                    item.alternative = replaced
                                }
                            }

                            return (
                                <div key={item.id} className={styles.alternativesItem}>
                                    <Button 
                                        disabled={itemDisabled}
                                        id={`alternative_${item.id}`} 
                                        onClick={()=>selectAlternative(item.id)} 
                                        className={`alternative-btn btn btn-primary`}
                                    >
                                        {HtmlParser(item.alternative, { transform: transform } )}
                                    </Button>
                                    {alternativeClassEl}
                                    { item.cost != 0 ? 'Custo: '+item.cost : null }
                                    { item.cost != 0 && item.gain_possibility ? ' - ' : null }
                                    { item.gain_possibility ? 'Possibilidade de Ganho: '+item.gain_possibility : null }
                                    <br/>
                                    ID: {item.id}
                                    <br/>
                                    CARTEIRA: + { item.wallet_gain }  |  - { item.wallet_loss }
                                    <br/>
                                    CONTRATO: + { item.client_gain }  |  - { item.client_loss }
                                </div>
                            )
                        })
                    }</div>

                    <div className={styles.confirm}>
                        <Button 
                            disabled={confirmState}
                            onClick={()=>confirmAlternative()} 
                            className="btn btn-success">
                            
                            {confirmText}
                        </Button>
                    </div>

                </div>

            </div>

            <div className={styles.sidebarHolder}>
                <div className={'sidebar '+styles.sidebar}>

                    <PlayerFrame user={user} wallet={wallet?.money} avatarGender={avatarGender} profileTeam={profileTeam} />

                    <PanelFrame
                        fases={fases}
                        currentFase={faseId}
                        storeItems={storeItems}
                        inventoryItems={inventoryItems}
                        user={user}
                        wallet={wallet}
                        changeStoreItems={setStoreItems}
                        changeInventory={setInventoryItems}
                        storeModal={storeModalShow}
                        changeStoreModal={setStoreModalShow}
                    />
                    
                </div>
            </div>

        </div>

		
    </div>)
}