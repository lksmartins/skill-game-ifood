import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/Review.module.css'
import HtmlParser from 'react-html-parser'
import TimerButton from '../../components/TimerButton'
import PlayerFrame from '../../components/PlayerFrame'
import { useFetch } from '../../context/Fetch'
import { useUser } from '../../context/User'
import Loading from '../../components/Loading'
import useSound from 'use-sound'

export async function getServerSideProps(context) {

    const hash = context.query.hash
	
	return {
		props: {
            hash: hash
		}
	}
}

export default function Review( props ) {

    const router = useRouter()
    const hash = props.hash
    const { user } = useUser()

    const { isLoading, value, error } = useFetch({
		action: 'getUserReview',
		hash: hash,
        user: user?.id,
        hash: hash
	})
    
    const wallet = value?.wallet
    const profileTeam = user?.profile_team_id
    const review = value?.review

    if( !isLoading && user?.timeEnd != null ){
        router.push(`/${hash}/obrigado`)
    }

    let teamClass = 'teamOne'

    const avatarGender = user?.avatar == 1 ? 'female' : 'male'

    if( isLoading || error ) {
		return <Loading />
	}

	return (<div className={teamClass+' '+styles.bg}>

        <div className={styles.container+' '+styles.review}>

            <div className={styles.title}>
                <img className={styles.firework1} src="https://branching-stories.s3.amazonaws.com/firework.gif"/>
                <img className={styles.firework2} src="https://branching-stories.s3.amazonaws.com/firework.gif"/>
                <img className={styles.firework3} src="https://branching-stories.s3.amazonaws.com/firework.gif"/>
                <img className={styles.firework4} src="https://branching-stories.s3.amazonaws.com/firework.gif"/>
                <img className={styles.firework5} src="https://branching-stories.s3.amazonaws.com/firework.gif"/>
            </div>
            
            <div className={styles.main}>

                <h1>Parabéns</h1>

				<h4>Parabéns, você conclui sua jornada no universo da Solarium. Graças a sua ajuda, os clientes da Solarium estão mais satisfeitos e mais protegidos das constantes ameaças que existem no universo. Esta aventura tem o propósito de transmitir um pouco mais da estratégia da SAP, para que você possa refletir por outras perspectivas, de como ela impacta suas ações no dia a dia.</h4>
                <h4>Esperamos que você tenha aprendido algo de novo e que use o formulário a seguir para compartilhar as suas percepções sobre o que o jogo quis explorar sobre a estratégia da SAP. Obrigado pela sua participação.</h4>

                <TimerButton onClick={()=>router.push(`/${hash}/questionario`)} start={true}>
                    Avançar
                </TimerButton>

            </div>

            <div className={styles.playerFrame}>
                <PlayerFrame user={user} wallet={wallet?.money} avatarGender={avatarGender} profileTeam={profileTeam} />
            </div>

        </div>

		
    </div>)
}