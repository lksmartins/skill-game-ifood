import React, {useState} from 'react'
import { useRouter } from 'next/router'
import styles from '../../../styles/Profile.module.css'
import TimerButton from '../../../components/TimerButton'
import { useUser } from '../../../context/User'

export default function PostProfile() {

    const { user } = useUser()

    const router = useRouter()
    const { hash, teamId } = router.query
    const avatarId = user?.avatar_id

    const [loadingPage, setLoadingPage] = useState(null)

    if( !user ){
        return (
            <div className={styles.bg}>
                <div className={styles.container}>
                    <p>Carregando...</p>
                </div>
            </div>
        )
    }

    function goToGame(){

        setLoadingPage(<i className="fas fa-spin fa-spinner"></i>)
        router.push(`/${hash}/pre-missao`)

    }

    const avatarGender = avatarId == 1 ? 'female' : 'male'

    let teamClass, teamName, teamText

    switch (teamId) {
        case '1':
            teamClass = 'teamOne'
            teamText = 'Ótimos na arte da persuasão.'
            teamName = 'Droids'
            break;
        
        case '2':
            teamClass = 'teamTwo'
            teamText = 'Prioriza mais o benefício ao cliente.'
            teamName = 'Sparks'
            break;

        case '3':
            teamClass = 'teamThree'
            teamText = 'Sabem tudo sobre o produto, ótimos para explicar tudo ao cliente.'
            teamName = 'Tekz'
            break;
        
        case '4':
            teamClass = 'teamFour'
            teamText = 'Estrategistas, querem entender o todo para tomar decisões.'
            teamName = 'Strats'
            break;
    
        default:
            teamClass = 'teamOne'
            teamText = 'Ótimos na arte da persuasão.'
            teamName = 'Droids'
            break;
    }

	return (<div className={teamClass+' '+styles.bg}>

        <div className={styles.container}>

            <div className={styles.main+' '+styles.postProfile}>

                <div className={styles.image}>
                    <img src={`https://branching-stories.s3.amazonaws.com/characters/${avatarGender}_0${teamId}.png`}/>
                </div>

                <div className={styles.text}>

                    <h3>Você foi escolhido para a Equipe <span>{teamName}</span></h3>
                    <p>
                        {teamText}
                    </p>

                    <TimerButton onClick={()=>goToGame()} start={true} time={10}>Avançar</TimerButton>

                    <div className={styles.loader}>
                        {loadingPage}
                    </div>

                </div>

            </div>

        </div>

		
    </div>)
}