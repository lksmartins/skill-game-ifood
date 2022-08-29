import React from 'react'
import Loading from '../../../../components/Loading'
import { useFetch } from '../../../../context/Fetch'
import ProgressBar from '../../../../components/ProgressBar'
import styles from '../../../../styles/Report.module.css'

import '../../../../node_modules/react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'

export async function getServerSideProps(context) {
	
	return {
		props: {
            groupHash: context.query.hash,
            userHash: context.query.userHash
		}
	}
}

export default function UserReport(props){
    
    const { groupHash, userHash } = props

    if( !userHash ) return <Loading/>

    const { isLoading, value, error } = useFetch({
		action: 'getReport',
		hash: groupHash,
		user: userHash
	})

    if( isLoading || error ) return <Loading/>

    const report = value

    let mainIndex = 0

    const result = Object.entries(report).map(([key,item],i) => {
                            
        if( key != 'map' && key != 'feedbacks'){

            return Object.entries(item).map(([k,v],a)=>{

                if( k == 'result' ){

                    return (<div key={`${k}${v}${a}`} className={styles.section}><div className={styles.highlight}>{v[0].fase_label}</div> <div>{
                        
                        v.map((val,i)=>{

                        const index = i + 1
                        const skillClass = `skill_${index}`
                        let color = 'cyan'
                        if( index/2 == 1 || index%5 == 0) color = 'yellow'
                        if( index%3 == 0 ) color = 'greenyellow'

                        return <div className={`${styles.skills} ${skillClass}`} key={skillClass}>
                            <div className={`${styles.skill} ${styles.title}`}>
                                {val.name}
                            </div>

                            <ProgressBar 
                                text={`${val.percentage}%`} 
                                number={val.percentage}
                                color={color}
                            />

                            <div className={styles.description}>
                                {val.description}
                            </div>
                        </div>
                    })}</div>
                    </div>)

                }

            })

        }

    })

    return (

        <div className={styles.bg}>
            <div className={styles.container}>
                <div className={styles.main}>

                    <h3 className={styles.title}>
                        Amostra - Relatório Parcial
                    </h3>
                    <p>Este é um relatório parcial da análise das habilidades do candidato(a) a partir das suas escolhas nas situações apresentadas no game. Para adquirir a solução completa, entre em contato com a iHunter.</p>
                    
                    <div className={styles.userName}><i className="fas fa-user"></i> {value?.userInfo?.name}</div>

                    <div className={styles.summary}>
                        { result }
                    </div>

                    <h3 className={styles.title}>Questões</h3>
                    <p>Suas escolhas em cada questão</p>

                    <Carousel showArrows={true}>
                        {   
                            Object.entries(report.feedback).map(([k,v],i)=>{

                                mainIndex=i

                                return (
                                    
                                    <div className={styles.slide} index={i} key={i}>
                                        
                                        <div className={styles.index}>{i+1} de {Object.entries(report.feedback).length+1}</div>

                                        <div className={styles.section}>
                                            <div className={styles.highlight}>Enunciado da Questão</div>
                                            <p>{v.question}</p>
                                        </div>

                                        <div className={styles.section}>
                                            <div className={styles.highlight}>Alternativa Escolhida</div>
                                            <div className={styles.alternative} style={{marginTop:'16px'}}>{v.alternative}</div>
                                        </div>
                                        
                                        <div className={styles.section}>
                                            <div className={styles.highlight}>Feedback da sua escolha</div>
                                            <div className={styles.feedback}>
                                                {v.feedbacks.map(val=>{
                                
                                                    return <div key={`${val.alternative_id}_${val.skill_id}`}>
                                                            <div className={`skill_${val.skill_id}`}>{val.skill_name}</div>
                                                            <p>{val.feedback}</p>       
                                                    </div>
                                
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                )
                
                            })  
                        }

                        <div className={styles.slide} index={mainIndex+1}>
                            
                            <div className={styles.index}>{mainIndex+2} de {Object.entries(report.feedback).length+1}</div>
                            
                            <div className={styles.section}>
                                <div className={styles.highlight+' '+styles.big}>Chave-Mestra</div>
                                <div className={styles.feedback}>
                                    <div className={styles.benefits}>
                                        Vantagens em adquirir o relatório completo!
                                    </div>
                                    <ul>
                                        <li>Identifique habilidades e competências de forma eficaz e divertida através do nosso produto.</li>
                                        <li>Através da gamificação, é possível identificar comportamentos e competências de forma espontânea.</li>
                                        <li>Temos games de diversas competências para você acertar no processo seletivo.</li>
                                        <li>Receba um relatório completo sobre as competências e habilidades mapeadas durante a experiência do jogo.</li>
                                    </ul>

                                    <div className={styles.cta}>
                                        <i className="fas fa-envelope-open-text"></i>
                                        <p>Entre em contato com a i-Hunter para saber mais.</p>
                                        <p>Obrigado por participar.</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        
                    </Carousel>
                </div>
            </div>
        </div>

    )

}