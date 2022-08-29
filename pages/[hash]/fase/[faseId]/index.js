import React, { useState, useEffect } from 'react'
import { useUser } from '../../../../context/User'
import { useFetch } from '../../../../context/Fetch'
import { useRouter } from 'next/router'
import styles from '../../../../styles/Group.module.css'
import Button from '../../../../components/Button'
import Popup from '../../../../components/Popup'
import PlayerFrame from '../../../../components/PlayerFrame'
import PanelFrame from '../../../../components/PanelFrame'
import Loading from '../../../../components/Loading'
import HtmlParser from 'react-html-parser'

export async function getServerSideProps(context) {

    const hash = context.query.hash
    const faseId = context.query.faseId
	
	return {
		props: {
            hash: hash,
            faseId: faseId
		}
	}
}

export default function Fase( props ) {

    const { user } = useUser()
    const hash = props.hash
    const faseId = props.faseId

    console.log('Fase -> props',props)
    
    const { isLoading, value, error } = useFetch({
		action: 'getUserState',
		hash: hash,
        user: user?.id,
        fase: faseId
	})

    const router = useRouter()
    const [groupData, setGroupData] = useState(value)
    const [ userState, setUserState ] = useState(value?.user)

    const fases = value?.fases // used to build map
    const profileTeam = user?.profile_team
    const userAnswers = value?.user_answers
    const userTime = groupData?.time
    const wallet = groupData?.wallet
    const question = groupData?.user_state?.question
    const alternatives = groupData?.user_state?.alternatives
    const clientsLabel = value?.clientsLabel

    const [watingResponse, setWatingResponse] = useState(false)
    const [storeItems, setStoreItems] = useState(groupData?.store)
    const [inventoryItems, setInventoryItems] = useState(groupData?.inventory)
    const [storeModalShow, setStoreModalShow] = useState(false)
    const [alternativeState, setAlternativeState] = useState(null)
    const [alternativeTimeState, setAlternativeTimeState] = useState( calculateUserTime() )
    const [convertedTimeState, setConvertedTimeState] = useState(0)
    const [pauseTimerState, setPauseTimerState] = useState(false)
    const [confirmState, setConfirmState] = useState('disabled')
    const confirmDefaultText = 'Confirmar Escolha'
    const [confirmText, setConfirmText] = useState(confirmDefaultText)
    const [alternativesLoading, setAlternativesLoading] = useState(true) // styles.alternativesLoading

    const [showQuestionId, setShowQuestionId] = useState(false)

    // popup
    const [popupToggle, setPopupToggle] = useState(false)
    const [popupContent, setPopupContent] = useState('')
    const [popupAction, setPopupAction] = useState('close')
    const [ popupImg, setPopupImg ] = useState('')
    const [ popupParam, setPopupParam ] = useState(null)

    // font size
    const [ fontSize, setFontSize ] = useState(1)

    useEffect(() => {

        console.log('USE EFFECT isLoading', isLoading, groupData, value)

        if( (groupData == null || undefined ) && value ){
            setGroupData(value)
        }

    },[isLoading])

    useEffect(() => {

        console.log('USE EFFECT groupData', groupData)
        if( groupData ){
            setStoreItems(groupData.store)
            setInventoryItems(groupData.inventory)
            setUserState(groupData.user)
        }

    },[groupData])

    useEffect(() => {

        console.log('USE EFFECT pauseTimerState', pauseTimerState)

        if(pauseTimerState==true) return

        const timer = setTimeout(() => {
            //console.log('****************** setTimeout', alternativeTimeState)
            setAlternativeTimeState( alternativeTimeState + 1 )
            updateTime()
        }, 1000)

        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer)

    },[])

    const [ prevInventoryItems, setPrevInventoryItems ] = useState([])

    useEffect(() => {

        console.log('USE EFFECT inventoryItems',inventoryItems)

        setWatingResponse(true)
        setPauseTimerState(true)
        setConfirmText(<i className="fas fa-spin fa-spinner"></i>)
        setConfirmState('disabled')

        if( JSON.stringify(prevInventoryItems) != JSON.stringify(inventoryItems) ){
            getUserState()
        }
        else{
            setConfirmText(confirmDefaultText)
            setWatingResponse(false)
            setPauseTimerState(false)
        }

        setPrevInventoryItems( inventoryItems )

    }, [inventoryItems])

    // startFaseReview
    useEffect(() => {

        console.log('USE EFFECT question,user,faseId', question,user,faseId)

        // startFaseReview
        if( question?.start == 1 && user && faseId ){

            fetch( process.env.API_URL, {
                method: 'POST',
                body: JSON.stringify({ 
                    token: process.env.API_KEY, 
                    action: 'startFaseReview',
                    user: user?.id,
                    faseId: faseId
                })
            })

        }

        // id enunciados
        const hostname = window.location.hostname

        // only show resetPlayer with these domains
        if( hostname == 'localhost' || hostname.includes('.vercel.app') ){
            setShowQuestionId(true)
        }

        // alternativas carregaram
        setAlternativesLoading(false)

    },[question,user,faseId])

    if( groupData?.user_state == null ){
        //router.push(`/${hash}/fases`)
    }
    
    const handleInfoUpdate = (data) => {
        setWatingResponse(false)
        setGroupData(data)
        setConfirmText(confirmDefaultText)
        setConfirmState('disabled')
        setPauseTimerState(false)
        deselectAllAlternatives()
        setAlternativesLoading(false)
    }

    async function getUserState(){

        setPauseTimerState(true)
        setAlternativesLoading(true)

        const res = await fetch( process.env.API_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                token: process.env.API_KEY, 
                action: 'getUserState',
                hash: hash,
                user: user?.id,
                fase: faseId
            })
        })
    
        const group_data = await res.json()
    
        //console.log(group_data)

        handleInfoUpdate(group_data.data)

    }

    function calculateUserTime(){

        //console.log( 'calculateUserTime' )

        let endTime = new Date()
        let startTime = new Date(userTime)

        let difference = endTime - startTime
        let timeLeft

        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        }

        timeLeft.days = timeLeft.days < 0 ? 0 : timeLeft.days
        timeLeft.hours = timeLeft.hours < 0 ? 0 : timeLeft.hours

        let res = (timeLeft.minutes*60)+timeLeft.seconds

        //console.log('res',res)
        
        return res

    }

    function deselectAllAlternatives(){
        const btns = document.getElementsByClassName('alternative-btn')
        for( let btn of btns ){
            btn.classList.remove("active")
        }
    }

    function selectAlternative( id ){

        console.log("selectAlternative 1")

        if( watingResponse ) return

        console.log("selectAlternative 2")

        const btns = document.getElementsByClassName('alternative-btn')
        for( let btn of btns ){
            btn.classList.remove("active")
        }

        document.getElementById(`alternative_${id}`).classList.add("active")
        setAlternativeState(id)
        setConfirmState('')
    
    }

    async function saveUserAnswer( alternative ){

        const time = calculateUserTime()

        console.log('saveUserAnswer', user.id, alternative.id, time, question )

        const res = await fetch( process.env.API_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                token: process.env.API_KEY, 
                action: 'saveUserAnswer',
                user: user.id,
                alternative: alternative.id,
                question: question.id,
                time: time
            })
        })

        const response = await res.json()

        //console.log('saveUserAnswer respose',response)

        setPauseTimerState(false)
        setAlternativeTimeState(0)

    }

    function conditions(alternative){

        if( alternative.id == 7 || alternative.id == 8 ){
            let choseBefore = false
            userAnswers.map(item=>{
                console.log(item)
                if( item.alternative_id == 5 ) choseBefore = true
            })
        }

    }
    
    async function confirmAlternative(){

        setWatingResponse(true)
        setPauseTimerState(true)
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
            inventoryItems?.map((item)=>{
                if( item.id == requestedItem ){
                    hasItem = true
                }
            })
            if( hasItem == false ){
                openPopup('Precisa de item e não tem no inventário')
                return false
            }
        }

        await saveUserAnswer(choosenAlternative)

        conditions(choosenAlternative)

        if( choosenAlternative.feedback != '' && choosenAlternative.feedback != null ){
            setPopupImg(choosenAlternative.feedback_img)
            openPopup(choosenAlternative.feedback)
        }

        if( question.fase_final == 1 && choosenAlternative.final == 1 ){
            if( choosenAlternative.feedback ){
                openPopup(choosenAlternative.feedback, 'router', `/${hash}/fase/${faseId}/review` )
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

    function updateTime(){

        //console.log('updateTime', alternativeTimeState)

        let currentTime = alternativeTimeState

        if( currentTime < 60 ){
            currentTime = currentTime < 10 ? `0${currentTime}` : currentTime
            setConvertedTimeState(`00:${currentTime}`)
            return
        }

        let time = {
            minutes: Math.floor((currentTime / 60) % 60),
            seconds: Math.floor((currentTime) % 60)
        }

        time.minutes = time.minutes < 10 ? `0${time.minutes}` : time.minutes
        time.seconds = time.seconds < 10 ? `0${time.seconds}` : time.seconds

        //console.log(`${time.minutes}:${time.seconds}`)

        setConvertedTimeState(`${time.minutes}:${time.seconds}`)
        return

    }

    let teamClass = 'teamOne'
    let titleClass = styles.teamOne

    const imageId = parseInt(question?.id) < 10 ? `0${question?.id}` : question?.id
    const image = `https://branching-stories.s3.amazonaws.com/enunciados/enunciado_${imageId}.png`
    const missionTitleBg = `https://branching-stories.s3.amazonaws.com/missioTitle0${faseId}.png`

    function openPopup(content, action=null, param=null){
        setPopupContent(content)

        if( action != null ){
            setPopupAction(action)
        }
        if( param != null ){
            setPopupParam(param)
        }

        setPopupToggle(true)
    }

    const avatarGender = user?.avatar_id == 1 ? 'female' : 'male'

    // font size
    function changeFontSize(operation){

        let newFontSize

        if(operation == '+'){
            newFontSize = fontSize+0.2
        }
        else{
            newFontSize = fontSize-0.2
        }

        if( newFontSize < 0.5 || newFontSize > 4.5){
            newFontSize = fontSize
        }

        setFontSize(newFontSize)
    }

    // alternatives treatments/conditions
    function changeLojaStr(Element){

        //console.log('changeLojaStr')
        //console.log(typeof Element)
        //console.log(Element)

        if( !Element ) return null

        if( typeof Element == 'string' ){
            if( Element.includes(' loja') ){
                let replaced = Element.replace(' loja', ' <span>loja</span>')
                return replaced
            }
            else{
                return Element
            }
        }

    }

    function transform(node) {
        if (node.type === 'tag' && node.name === 'span') {
            return <div className="spanLoja">loja</div>
        }
    }

    function popupAlternativeLockedByItem( text ){
        setPopupContent(text)
        setPopupToggle(true)
    }

    if( isLoading || error ) {
		return <Loading />
	}

    if( groupData?.user_state == null ) {
        //router.push(`/${hash}/review`)
    }

	return (<div className={teamClass}>

        <Popup
            toggle={popupToggle}
            setToggle={setPopupToggle}
            content={popupContent}
            action={popupAction}
            param={popupParam}
            img={popupImg}
        />

        <div className={styles.confirm}>

            <div className={styles.fontSize}>
                <p><i className="fas fa-cog"></i> Tamanho da fonte:</p>
                <div className={styles.buttons}>
                    <button onClick={()=>changeFontSize('-')} className={`btn btn-primary ${styles.btnFont}`}>
                        <i className="fas fa-minus"></i>
                    </button>
                    <button onClick={()=>changeFontSize('+')} className={`btn btn-primary ${styles.btnFont}`}>
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
            </div>

            <Button 
                disabled={confirmState}
                onClick={()=>confirmAlternative()} 
                className="btn btn-success">
                
                {confirmText}
            </Button>

        </div>

        <div className={styles.container}>

            <div className={styles.main}>

                <div className={styles.image}>
                    <div className={styles.title}>
                        <img src={missionTitleBg}/>
                    </div>
                    <img src={image}/>
                </div>

                <div className={styles.content}>
                    
                    <div className={styles.title}>
                        <h4 style={{ fontSize: (fontSize + 0.2)+'rem' }}>{ showQuestionId ? question?.id+': ' : null }{ HtmlParser( changeLojaStr(question?.question), { transform: transform } )}</h4>
                    </div>

                    <div className={styles.alternatives}>
                        <div className={alternativesLoading ? styles.alternativesLoading : styles.alternativesNotLoading}>
                            <i className="fas fa-spinner fa-spin"></i>
                            <p>Carregando alternativas</p>
                        </div>
                        {
                        alternatives?.map(item=>{
                            let itemDisabled = null
                            let allowStoreCheck = true
                            let alternativeClassEl = ''
                            let lockedByItem = false
                            let lockedByItemText = 'Você precisa de um item da loja para selecionar essa alternativa.'

                            // remedios com limpeza
                            if( question?.id == 3){
                                itemDisabled = 'disabled'
                                allowStoreCheck = false
                                lockedByItem = true
                                lockedByItemText = 'Você precisa de dois item da loja para selecionar essa alternativa. Limpeza Vorbes Emergencial e o Remédio correspondente.'

                                inventoryItems?.map(inventoryItem=>{
                                    if( inventoryItem.id == 2 ){ // limpeza de vorber emergencial
                                        itemDisabled = null
                                        allowStoreCheck = true
                                    }
                                })
                            }

                            // todos remedio e limpeza
                            if( parseInt(item.id) == 38){
                                itemDisabled = 'disabled'
                                allowStoreCheck = false
                                lockedByItem = true
                                lockedByItemText = 'Você precisa de alguns itens da loja para selecionar essa alternativa. Limpeza Vorbes Emergencial e todos Remédios.'
                                
                                let countItems = 0
                                inventoryItems?.map(inventoryItem=>{
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

                            // check normal de item de loja
                            if( item.requestedStoreItem != 0 && allowStoreCheck==true ){
                                itemDisabled = 'disabled'
                                lockedByItem = true
                                inventoryItems?.map(inventoryItem=>{
                                    if( inventoryItem.id == item.requestedStoreItem ){
                                        itemDisabled = null
                                        lockedByItem = false
                                    }
                                })
                            }
                            // if alternative has already been answered
                            userAnswers?.map(answer=>{
                                if( answer.alternative_id == item.id ){
                                    if( item.id == 5 || item.id == '5'){
                                        alternativeClassEl = <div className="answered correct"></div>
                                    }else{
                                        alternativeClassEl = <div className="answered wrong"></div>
                                    }
                                    itemDisabled = 'disabled'
                                }
                            })

                            // mission 3 - geometry figures
                            if( question?.id == 24 ){
                                if( [69,70,71,72].includes( parseInt(item.id) ) ){

                                    let type = typeof item.alternative

                                    if( type == 'string' ){

                                        if( !item.alternative.includes('<img') ){
                                            
                                            if( type == 'string' ){
                                                let replaced = '<img src="https://branching-stories.s3.amazonaws.com/missao3/'+item.alternative+'.png"/>'
                                                item.alternative = replaced
                                            }
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

                                    <div onClick={ lockedByItem == true ? ()=>popupAlternativeLockedByItem(lockedByItemText) : null} >
                                        <Button 
                                            disabled={itemDisabled}
                                            id={`alternative_${item.id}`} 
                                            onClick={()=>selectAlternative(item.id)} 
                                            className={`alternative-btn btn btn-primary ${lockedByItem == true ? styles.lockedByItem : ''}`}
                                        >
                                            <div style={{ fontSize: fontSize+'rem' }}>{HtmlParser(item.alternative, { transform: transform } )}</div>
                                        </Button>
                                    </div>
                                    
                                    {
                                        // item for answered
                                        alternativeClassEl
                                    }

                                    { item.cost != 0 ? 'Custo: '+item.cost : null }
                                    { item.cost != 0 && item.gain_possibility ? ' - ' : null }
                                    { item.gain_possibility ? 'Possibilidade de Ganho: '+item.gain_possibility : null }
                                </div>
                            )
                        })
                    }</div>

                    

                </div>

            </div>

            <div className={styles.sidebarHolder}>
                <div className={'sidebar '+styles.sidebar}>

                    <PlayerFrame 
                        user={userState} 
                        wallet={wallet?.money} 
                        avatarGender={avatarGender} 
                        profileTeam={profileTeam} 
                        clientsLabel={clientsLabel}
                    />

                    <PanelFrame
                        fases={fases}
                        currentFase={faseId}
                        storeItems={storeItems}
                        inventoryItems={inventoryItems}
                        user={userState}
                        wallet={wallet}
                        changeStoreItems={setStoreItems}
                        changeInventory={setInventoryItems}
                        storeModal={storeModalShow}
                        changeStoreModal={setStoreModalShow}
                        setAlternativesLoading={setAlternativesLoading}
                    />
                    
                </div>
            </div>

        </div>

		
    </div>)
}