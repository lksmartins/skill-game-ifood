import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/Fases.module.css'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import { useUser } from '../../context/User'
import { useFetch } from '../../context/Fetch'

export async function getServerSideProps(context) {
    
	return {
		props: {
            hash: context.query.hash,
            isIhunter: context.req.url.includes('ihunter')
		}
	}
}

export default function Fases(props) {

	const { user } = useUser()
	const router = useRouter()
	const hash = props.hash || user?.groupHash	
	const { isIhunter } = props

	if( !router.isReady ) {
		return <Loading/>
	}
	
	const { isLoading, value, error } = useFetch({
		action: 'getFases',
		hash: hash,
		user: user?.id
	})

	const fases = value?.fases

	function goToFase( fase ){
		router.push(`/${hash}/fase/${fase}`)
	}

	let showPreGame = true
	let fasesSolvedCounter = 0
	let fasesCounter = 0

	fases?.map(fase=>{
		fasesCounter++
		if(fase.solved == true ){
			showPreGame = false
			fasesSolvedCounter++
		}
	})

	if( isLoading || error ) {
		return <Loading/>
	}

	// check if user is logged in
	if( !user ){
		if( router.isReady ) {
			router.push('/signin')
		}
	}

	if( (fasesCounter == fasesSolvedCounter) && hash != '6c300462' ){
		if( value?.group.has_report == '1' ){
			router.push(`/${hash}/report`)
		}
		else{
			router.push(`/${hash}/review`)
		}
	}

	/* if( user?.timeEnd != null && !isIhunter ){
		router.push(`/${hash}/obrigado`)
	} */

	if( hash == undefined ){
		return <Loading/>
	}

	return (<div className={styles.bg+' teamOne'}>

        <div className={styles.container}>

            <div className={styles.main}>

				<div className={styles.fases}>{
					fases?.map( item => {
						let faseClass = item.solved == true ? styles.fase+' '+styles.solved : styles.fase
						let btnDisabled = item.solved == true ? 'disabled' : null
						let showSolved = item.solved == true ? <div className={styles.labelSolved}>Concluída</div> : null

						// missao bloqueada
						if( item.start != 1 ){
						
							//console.log(item.id, fases[(parseInt(item.id)-2)])

							if( (parseInt(item.id)-2) in fases ){
								if( fases[(parseInt(item.id)-2)].solved == false ){
									btnDisabled = 'disabled'
									faseClass = styles.fase+' '+styles.locked
									showSolved = <div className={styles.labelLocked}>Bloqueada</div>
								}
							}
						}

						// for demo only
						if( hash == '6c300462' ){
							if(item.id > 4){
								btnDisabled = 'disabled'
								faseClass = styles.fase+' '+styles.locked
								showSolved = <div className={styles.labelLocked}>Bloqueada</div>
							}
						}

						return (
							<div key={item.id} className={faseClass}>
								<img src={item.img ? item.img : `https://branching-stories.s3.amazonaws.com/missao${item.id}_img.png`}/>
								<p>
									{item.text}
								</p>
								<Button id={`fase_${item.id}`} onClick={()=>goToFase(item.id)} disabled={btnDisabled}>
									Iniciar Missão
								</Button>
								{showSolved}
							</div>
						)
						
					})
				}
				</div>

            </div>

        </div>

		
    </div>)
}