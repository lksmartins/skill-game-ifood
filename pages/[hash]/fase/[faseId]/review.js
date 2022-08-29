import React, {useState} from 'react'
import { useRouter } from 'next/router'
import styles from '../../../../styles/FaseReview.module.css'
import { useUser } from '../../../../context/User'
import { useFetch } from '../../../../context/Fetch'
import useSound from 'use-sound'
import Button from '../../../../components/Button'
import HtmlParser from 'react-html-parser'
import Loading from '../../../../components/Loading'

export async function getServerSideProps(context) {

    const hash = context.query.hash
    const faseId = context.query.faseId

	/* const res = await fetch( process.env.API_URL, {
		method: 'POST',
		body: JSON.stringify({ 
			token: process.env.API_KEY, 
			action: 'getFaseReview',
            user: session.user.email,
            hash: hash,
            fase: faseId
		})
	})

	const data = await res.json() */

    //console.log(data)
	
	return {
		props: {
            hash: hash,
            faseId: faseId
		}
	}
}

export default function Review( props ) {

    const { user } = useUser()
    const hash = props.hash
    const faseId = props.faseId

    const { isLoading, value, error } = useFetch({
		action: 'getFaseReview',
		hash: hash,
        user: user?.id,
        fase: faseId
	})

    const router = useRouter()
    const profileTeam = user?.profile_team_id
    const review = value?.review
    const wallet = review?.wallet       
    const clients = review?.clients

    const [loadingPage, setLoadingPage] = useState('Voltar para missões')
    const [audioClick] = useSound('https://branching-stories.s3.amazonaws.com/audio/click-v1.mp3', {volume:0.6})

    function goToFases(){
        audioClick()
        setLoadingPage(<i className="fas fa-spin fa-spinner"></i>)
        router.push(`/${hash}/fases`)
    }

    function formatTime(seconds){

        let timeLeft = {
            days: Math.floor(seconds / ( 60 * 60 * 24)),
            hours: Math.floor((seconds / ( 60 * 60)) % 24),
            minutes: Math.floor((seconds / 60) % 60),
            seconds: Math.floor(seconds % 60)
        }

        timeLeft.hours = timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours
        timeLeft.minutes = timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes
        timeLeft.seconds = timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds

        return `${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`

    }

    let teamClass

    switch (profileTeam) {
        case '1':
            teamClass = 'teamOne'
            break;
        
        case '2':
            teamClass = 'teamTwo'
            break;

        case '3':
            teamClass = 'teamThree'
            break;
        
        case '4':
            teamClass = 'teamFour'
            break;
    
        default:
            teamClass = 'teamOne'
            break;
    }

    if( !user ){
        return (
            <div className={teamClass}>
                <div className={styles.container+' '+styles.review}>
                    <div className={styles.innerContainer}>
                        <p>Carregando...</p>
                    </div>
                </div>
            </div>
        )
    }

    if(isLoading || error ){
        return <Loading/>
    }

	return (<div className={teamClass}>

        <div className={styles.container+' '+styles.review}>

            <div className={styles.innerContainer}>

                <div className={styles.text}>
                    <img src="https://branching-stories.s3.amazonaws.com/trophy.gif"/>
                    <h4>{HtmlParser(review?.text)}</h4>
                </div>

                <div className={styles.main}>

                    <table>
                        <tbody>
                            <tr className={styles.header}><th>Tempo</th></tr>
                            <tr>
                                <td>{formatTime(review?.time)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <br/>

                    <table>
                        <tbody>
                            <tr className={styles.header}><th colSpan="3">Carteira</th></tr>
                            <tr>
                                <th>Início da Fase</th>
                                <th>Final da Fase</th>
                                <th>Balanço</th>
                            </tr>
                            <tr>
                                <td>{wallet?.start}</td>
                                <td>{wallet?.end}</td>
                                <td>{wallet?.balance}</td>
                            </tr>
                        </tbody>
                    </table>

                    <br/>

                    <table>
                        <tbody>
                            <tr className={styles.header}><th colSpan="3">{review?.clientsLabel}</th></tr>
                            <tr>
                                <th>Início da Fase</th>
                                <th>Final da Fase</th>
                                <th>Balanço</th>
                            </tr>
                            <tr>
                                <td>{clients?.start}</td>
                                <td>{clients?.end}</td>
                                <td>{clients?.balance}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br/>

                    <div className={`Floatconfirm ${styles.confirm}`}>
                        <Button onClick={()=>goToFases()}>
                            {loadingPage}
                        </Button>
                    </div>

                </div>

            </div>

        </div>

		
    </div>)
}