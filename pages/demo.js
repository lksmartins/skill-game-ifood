import React, {useState,useEffect} from 'react'
import styles from '../styles/pages/demo.module.css'
import Alert from '../components/Alert/Alert'
import {funcFetch} from '../context/Fetch'
import {useLocalStorage} from '../context/LocalStorage'
import {useRouter} from 'next/router'

export default function demo() {

    const router = useRouter()

    const missions = [
        {id:7, title:'Entender para atender', skills:['Foco no Cliente', 'Negociação', 'Atendimento'], time:'5min', locked:false},
        {id:8, title:'Vai lá e faz', skills:['Visão de Negócio', 'Protagonismo'], time:'5min', locked:false},

        {id:1, title:'Um novo jeito', skills:['Capacidade analítica', 'Inovação'], time:'5min', locked:true},
        {id:2, title:'Na forma da água', skills:['Aprendizagem ativa'], time:'5min', locked:true},
        {id:6, title:'Comunicar para ganhar', skills:['Comunicação','Colaboração'], time:'5min', locked:true},
        {id:3, title:'Ache a solução', skills:['Resoluçao de problemas'], time:'5min', locked:true},
        {id:4, title:'Influência é poder', skills:['Liderança'], time:'5min', locked:true},
        {id:5, title:'Convencer para vender', skills:['Persuasão', 'Negociação'], time:'5min', locked:true},
    ]

    const [ selectedMissions, setSelectedMission ] = useState([])
    const maxSelectedMissions = 2

    const [ alertText, setAlertText ] = useState('')
    const [ alertShow, setAlertShow ] = useState(false)
    const [ alertClass, setAlertClass ] = useState(null)
    const [ redirectTimer, setRedirectTimer ] = useState(3)

    const [ isLoading, setIsLoading ] = useState(false)

    const [ localGameHash, setLocalGameHash ] = useLocalStorage('gameHash')
    const [ localSignupRedirect, setLocalSignupRedirect ] = useLocalStorage('signupRedirect')

    function selectMission(missionId){

        // deselect
        if( selectedMissions.includes(missionId) ){
            const thisArr = selectedMissions.filter(function(value, index, arr){ 
                return value != missionId;
            })
            setSelectedMission(thisArr)
            return
        }

        // check if hitted max
        if( selectedMissions.length >= maxSelectedMissions){
            setAlert('Você pode selecionar no máximo 2 missões!')
        }
        else{
            const thisArr = [...selectedMissions]
            thisArr.push(missionId)
            setSelectedMission(thisArr)
        }
    }

    function setAlert(text){
        setAlertText(text)
        setAlertShow(true)
        setAlertClass(null)
    }

    function successAlert(){
        
        setAlertShow(true)
        setAlertClass('success')
        setAlertText(`Jogo criado com sucesso! Você será redirecionado em ${redirectTimer} segundos...`)
        const timer = redirectTimer-1

        setTimeout(() => {
            setRedirectTimer(timer)
        },1000)
    }

    /*
    -depois da tela de cadastro vai para /grupoHash (verificar /profile)
    -Para iniciar o jogo teste faça o cadastro
    -desfecho da historia, timers para 3s
    */

    useEffect(() => {

        if( !alertShow && redirectTimer > 0 ) return

        setAlertText(`Jogo criado com sucesso! Você será redirecionado em ${redirectTimer} segundos...`)

        if( redirectTimer > 0 ){
            setTimeout(() => {
                setRedirectTimer(redirectTimer-1)
            },1000)
        }
        else{
            // redirect
            console.log('redirect')
            setLocalSignupRedirect(`/${localGameHash}`)
            router.push('/signup')
            //setRedirectTimer(3)
        }

    },[redirectTimer])

    function createGame(){

        setIsLoading(true)

        const handleSuccess = (data) => {
            /*
            -salvar a group hash no local storage
            -mensagem de sucesso ao criar o jogo(auto redirect em 3s...)
            */
            setLocalGameHash(data.hash)
            successAlert()
        }

        const handleError = (data) => {
            console.log("🚀 ~ file: demo.js ~ line 65 ~ handleError ~ data", data)
            setAlert('Houve um erro na tentativa de criar o seu jogo, recarregue a página e tente novamente.')
        }

        const handleFinally = () => {
            setIsLoading(false)
        }

        funcFetch({
            body:{
                action: 'createGroup',
                fases: selectedMissions
            },
            handleSuccess,
            handleError,
            handleFinally
        })

    }

    return(
        <div className={styles.demo}>

            <Alert show={alertShow} setShow={setAlertShow} text={alertText} class={alertClass}/>
            
            <div className={styles.pageTitle}>
                <h2>Monte o seu jogo</h2>
                <p>Escolha 2 missões para criar uma experiência única!</p>
            </div>

            <div className={styles.missions}>
                {
                    missions.map(item=>{
                        return <div key={item.id} onClick={()=>selectMission(item.id)} className={`${styles.mission} ${item.locked && styles.locked} ${selectedMissions.includes(item.id) && styles.selected}`}>
                            <div className={styles.title}>{item.title}</div>
                            <div className={styles.time}>Tempo estimado: {item.time}</div>
                            <div className={styles.skills}>
                                {
                                    item.skills.map((skill,i)=>{
                                        return <div key={i} className={styles.skill}>
                                            {skill}
                                        </div>
                                    })
                                }
                            </div>                            
                        </div>
                    })
                }
            </div>

            <div className={styles.btnHolder}>
                <p>Missões selecionadas: {selectedMissions.length} de {maxSelectedMissions}</p>
                <button onClick={()=>createGame()} disabled={selectedMissions.length<maxSelectedMissions || isLoading && true} className={styles.btn}>{isLoading?<i className="fas fa-spin fa-spinner"></i>:'Continuar'}</button>
            </div>
            
        </div>
    )
}