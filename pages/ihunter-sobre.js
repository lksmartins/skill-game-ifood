import React from 'react'
import styles from '@styles/pages/ihunterSobre.module.css'
//import Carousel from '@components/Carousel/Carousel'
import Form from '@components/EmailForm'
import getFilesFromDir from '@lib/getFilesFromDir'

export function getStaticProps(){

    return {
        props:{
            logos: getFilesFromDir('logos')
        }
    }
}

export default function Contato(props) {

    const {logos} = props

    const clients = logos.map(item=>{
        return <img key={item} src={`/logos/${item}`}/>
    })

    return(
        <div className={styles.sobre}>
            
            <div className={styles.col}>

                <div className={`${styles.text} ${styles.panel}`}>
                    <h3>Sobre o Skill Game</h3>
                    <p>Skill Game é a ferramenta ideal para recrutamento e seleção. Através de uma atividade lúdica e divertida, conseguimos analisar competências e habilidades comportamentais que são essenciais para selecionar o canditato mais adequado para sua necessidade. Nesta atividade o candidato irá interagir com uma história onde deverá tomar decisões para avançar em sua missão. Após a conclusão do jogo, será gerado um relatório com a performance de cada candidato de acordo com as decisões que foram tomadas durante o jogo. Temos 8 missões, cada uma focada em determinadas habilidades, e o recrutador pode montar um jogo com as habilidades que condizem com o perfil que está buscando no seu processo de recrutamento. Faça o nosso jogo teste para saber mais e se tiver dúvidas, utilize o formulário ao lado e entre em contato com a gente. Bom jogo.</p>
                </div>

                <div className={`${styles.logos} ${styles.panel}`}>
                    <h3>Quem faz</h3>
                    <div>
                        <a target="_blank" href="https://chavemestra.net/gamificacao"><img src="/CM-Corp-Branco.png"/></a>
                        <a target="_blank" href="https://i-hunter.com"><img src="/ihunter/logo_i-hunter_BRANCO.png"/></a>
                    </div>
                </div>

            </div>

            <div className={styles.col}>
                <img className={styles.skillGame} src="/SKILL-GAME-LIGHTER.png"/>
                <img className={styles.robot} src="/ihunter/robot.png"/>
            </div>

            {/* <div className={`${styles.col} ${styles.full} ${styles.panel}`} style={{paddingBottom:'0px'}}>
                <h3 style={{marginBottom:'-12px'}}>Quem usa</h3>
                <Carousel>
                    {clients}
                </Carousel>
            </div> */}

            <div className={`${styles.col} ${styles.full} ${styles.panel}`}>
                <h3>Suporte</h3>
                <p style={{marginTop:'-20px'}}>Ficou alguma dúvida ou encontrou algum problema? Entre em contato pelo formulário abaixo:</p>
                <Form emailTo={['corporativo@chavemestra.net','martins@chavemestra.net']}/>
            </div>
            
        </div>
    )
}