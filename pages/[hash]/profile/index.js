import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../../../styles/Profile.module.css'
import Button from '../../../components/Button'
import { useUser } from '../../../context/User'

export default function Profile() {

    const router = useRouter()
    const { user, setUser } = useUser()
    const { hash } = router.query

    const profile = user
    //const profile = {profile_team:0}

    if( profile?.profile_team != 0 ){
        // go to game
        if( hash != undefined && hash != 'undefined'){
            //router.push(`/${hash}/pre-missao`)
        }
        else{
            //router.push(`/`)
        }
    }

    const [currentQuestion, setCurrentQuestion] = useState(1)
    const [confirmButtonDisabled, setConfirmButtonDisabled] = useState('disabled')
    const [confirmButtonText, setConfirmButtonText] = useState('Confirmar')

    const questions = [
        
        {id: 1, question:'Um cliente chega para você com um problema que não é da sua área de competência. O que você normalmente faz no seu dia a dia?', alternatives:[
            {id: 1, description: 'Encaminho a demanda para a área responsável pelo problema e aguardo que uma providência seja tomada.', cat: 'a'},
            {id: 2, description: 'Busco resolver o problema mesmo não sendo minha expertise.', cat: 'b'},
            {id: 3, description: 'Busco a área responsável e trabalho junto com eles para resolver o problema.', cat: 'c'},
            {id: 4, description: 'Entendo o problema do cliente, comunico a área responsável e acompanho a solução.', cat: 'd'},
        ]},

        {id: 2, question:'Você foi convocado para dar um curso sobre vendas. Qual a principal lição?', alternatives:[
            {id: 5, description: 'O mais importante é prospectar deals para fechar o maior número de contratos.', cat: 'a'},
            {id: 6, description: 'O mais importante é estar sempre disponível para atender seus clientes.', cat: 'b'},
            {id: 7, description: 'O mais importante é aumentar o ticket médio dos clientes atuais.', cat: 'c'},
            {id: 8, description: 'O mais importante é atuar a partir do entendimento das necessidades dos clientes.', cat: 'd'},
        ]},

        {id: 3, question:'Em uma conversa com um novo potencial cliente, o que é mais importante?', alternatives:[
            {id: 9, description: 'Persuadir o cliente a comprar o que eu tenho para vender.', cat: 'a'},
            {id: 10, description: 'Criar rapport com o cliente para criar relacionamento.', cat: 'b'},
            {id: 11, description: 'Educar o cliente sobre a empresa e os produtos que ela tem a oferecer.', cat: 'c'},
            {id: 12, description: 'Entender o negócio do cliente para ver como posso melhor atender.', cat: 'd'},
        ]},

        {id: 4, question:'Você acabou de fechar um contrato, porém ainda não alcançou sua meta do mês. O que você faz?', alternatives:[
            {id: 13, description: 'Agendo uma reunião com um novo prospect para correr atrás da meta.', cat: 'a'},
            {id: 14, description: 'Faço uma ligação para o cliente agradecendo pela aquisição.', cat: 'b'},
            {id: 15, description: 'Faço uma análise do meu pipeline para entender onde devo priorizar minha estratégia de prospecção.', cat: 'c'},
            {id: 16, description: 'Garanto que o cliente receba o produto adquirido.', cat: 'd'},
        ]},

        {id: 5, question:'Qual minha principal qualidade como vendedor?', alternatives:[
            {id: 17, description: 'Persuasão', cat: 'a'},
            {id: 18, description: 'Relacionamento', cat: 'b'},
            {id: 19, description: 'Conhecimento técnico', cat: 'c'},
            {id: 20, description: 'Visão Sistêmica', cat: 'd'},
        ]},

    ]

    const [currentQuestionText, setCurrentQuestionText] = useState(questions[(currentQuestion-1)].question)

    const [alternativeState, setAlternativeState] = useState(null)
    const [currentAlternative, setCurrentAlternative] = useState(null)

    function selectAlternative( id, obj ){

        const btns = document.getElementsByClassName('alternative-btn')

        for( let btn of btns ){
            btn.classList.remove("active")
        }
        document.getElementById(`alternative_${id}`).classList.add("active")

        setAlternativeState(id)
        setCurrentAlternative(obj)
        setConfirmButtonDisabled('')
        setUpdateStage(true)
    
    }

    const [savedAlternatives, setSavedAlternatives] = useState([])
    
    async function chooseAlternative(){

        // verify if any alternative is selected
        if( alternativeState == null ){
            alert('Escolha uma das alternativas')
            return false
        }

        setConfirmButtonText(<i className="fas fa-spin fa-spinner"></i>)
        setUpdateStage(true)

        const choosenAlternative = currentAlternative

        // save choosen alternative locally

        let savedObj = {
            question: questions[currentQuestion-1].question, 
            answer: choosenAlternative
        }

        let newSaved = [...savedAlternatives, savedObj]
        setSavedAlternatives(newSaved)

        // load next alternatives
        if( questions[currentQuestion] != undefined ){
            setCurrentQuestionText( questions[currentQuestion].question )
            setCurrentQuestion( currentQuestion+1 )
        }
        else{ // there is no more questions left

            //save alternatives
            await saveAnswers( newSaved )

            // redirect to next page
            //router.push(`/group/${props.hash}`)
        }

        setConfirmButtonDisabled('disabled')
        setConfirmButtonText('Confirmar')
        setUpdateStage(true)

    }

    async function saveAnswers( answers ){

        console.log('saveAnswers')
        console.log(answers)

        const res = await fetch( process.env.API_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                token: process.env.API_KEY, 
                action: 'saveProfileAnswers',
                user: user.id,
                answers: answers
            })
        })

        const data = await res.json()
    
        router.push(`/${hash}/profile/${data.teamId}`)

    }

    const alternatives = []

    for( const question of questions ){
        if( question.id == currentQuestion ){
            for( let qAlternatives of question.alternatives ){
                alternatives.push(qAlternatives)
            }
        }
    }

    // AVATAR
    const [confirmAvatarButtonDisabled, setConfirmAvatarButtonDisabled] = useState('disabled')
    const [confirmAvatarButtonText, setConfirmAvatarButtonText] = useState('Confirmar')
    const [selectedAvatar, setSelectedAvatar] = useState(null)

    function selectAvatar(id){

        console.log('selectAvatar', id)
        
        const btns = document.getElementsByClassName('avatar-btn')

        for( let btn of btns ){
            btn.classList.remove("active")
        }
        document.getElementById(`avatar_${id}`).classList.add("active")

        setSelectedAvatar(id)
        setConfirmAvatarButtonDisabled('')
        setUpdateStage(true)

    }

    async function confirmAvatar(){

        console.log('confirmAvatar')
        console.log(selectedAvatar)

        setConfirmAvatarButtonText(<i className="fas fa-spin fa-spinner"></i>)
        setUpdateStage(true)

        const res = await fetch( process.env.API_URL, {
            method: 'POST',
            body: JSON.stringify({ 
                token: process.env.API_KEY, 
                action: 'saveUserAvatar',
                user: user.id,
                avatar_id: selectedAvatar
            })
        })

        const response = await res.json()

        console.log(response)

        setUser(response.user)
        setStageLabel('questions')
        setUpdateStage(true)

    }

    const [stageLabel, setStageLabel] = useState('avatar')
    const [stage, setStage] = useState(null)
    const [updateStage, setUpdateStage] = useState(true)

    // SELECT STAGE
    if( stageLabel == 'avatar' ){

        // AVATAR
        let content = (
            <>

            <div className={styles.avatar}>

                <div className={styles.title}>
                    Escolha seu avatar:
                </div>

                <div className={styles.buttons}>
                    <Button
                    id="avatar_1"
                    onClick={()=>selectAvatar(1)}
                    className="btn btn-primary avatar-btn">
                        <img src="https://branching-stories.s3.amazonaws.com/characters/female_01.png"/>
                    </Button>

                    <Button
                    id="avatar_2"
                    onClick={()=>selectAvatar(2)}
                    className="btn btn-primary avatar-btn">
                        <img src="https://branching-stories.s3.amazonaws.com/characters/male_01.png"/>
                    </Button>
                </div>

                <div className="Floatconfirm">
                    <Button disabled={confirmAvatarButtonDisabled} onClick={()=>confirmAvatar()} className="btn btn-success">
                        {confirmAvatarButtonText}
                    </Button>
                </div>

            </div>

            </>
        )

        if( updateStage ){
            setStage(content)
            setUpdateStage(false)
        }

    }

    if( stageLabel == 'questions' ){

        // QUESTIONS

        let content = (
            <div className={styles.questions}>

                <div className={styles.title}>
                    <h4>{currentQuestionText}</h4>
                </div>

                <div className={styles.alternatives}>{
                    alternatives.map( alternative => {
                        return (
                            <div key={alternative.id} className={styles.alternativesItem}>
                                <Button 
                                    id={`alternative_${alternative.id}`} 
                                    onClick={()=>selectAlternative(alternative.id, alternative)} 
                                    className="alternative-btn btn btn-primary">
                                    {alternative.description}
                                </Button>
                            </div>
                        )
                        
                    })
                }</div>

                <div className="Floatconfirm">
                    <Button disabled={confirmButtonDisabled} onClick={()=>chooseAlternative()} className="btn btn-success">
                        {confirmButtonText}
                    </Button>
                </div>

            </div>
        )

        if( updateStage ){
            setStage(content)
            setUpdateStage(false)
        }
    }

	return (<div className={styles.bg}>

        <div className={styles.container}>

            <div className={styles.main}>

                {stage}

            </div>

        </div>

		
    </div>)
}