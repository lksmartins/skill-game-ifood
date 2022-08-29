import {useRouter} from 'next/router'
import styles from '../styles/Home.module.css'
import Button from '../components/Button'
//import Carousel from '../components/Carousel/Carousel'
import getFilesFromDir from '../lib/getFilesFromDir'

export function getStaticProps(){
  return {
      props:{
          logos: getFilesFromDir('logos/png/')
      }
  }
}

export default function Home(props) {

  const router = useRouter()
  const {logos} = props

  const clients = logos.map(item=>{
      //console.log(item)
      return <img key={item} src={`/logos/png/${item}`}/>
  })
  //console.log("🚀 ~ file: index.js ~ line 29 ~ clients ~ clients", clients)
  //const groupId = '6c300461'
  
  return (
    <div className={styles.bg}>
      <div className={styles.container}>

        <div className={`${styles.row} ${styles.flexRow}`}>
          
          <div className={styles.poster}>
            {/* <img src="https://branching-stories.s3.amazonaws.com/SOLARIUM_720.jpg"/> */}
            <img src="/SKILL-GAME-LIGHTER.png"/>

            <Button 
              onClick={()=>router.push(`/demo`)} 
              className={`${styles.panel} ${styles.btn}`}>
              <i className="fas fa-rocket"></i> Fazer jogo teste
            </Button>
            <a
                href="#contato"
                className={`${styles.panel} ${styles.btn} ${styles.blue}`}>
                <i className="fas fa-envelope"></i> Quero saber mais
            </a>
            
          </div>

          <main className={`${styles.main} ${styles.panel}`}>

            <div className={styles.title}>
              Sobre o Skill Game
            </div>

            <p>
              Skill Game é a ferramenta ideal para recrutamento e seleção, análise comportamentais, treinamentos, people analytics e muito mais. Através de uma atividade lúdica e divertida, conseguimos analisar competências e habilidades comportamentais que são essenciais para suas necessidades. Nesta atividade o jogador irá interagir com uma história onde deverá tomar decisões para avançar em sua missão. Após a conclusão do jogo, será gerado um relatório com a performance de cada participante de acordo com as decisões que foram tomadas durante o jogo. Temos 8 missões, cada uma focada em determinadas habilidades, e o analisador pode montar um jogo com as habilidades que condizem com a sua necessidade de atividade. Faça o nosso jogo teste para saber mais e se tiver dúvidas, utilize o formulário ao lado e entre em contato com a gente. Bom jogo.
            </p>

            <div className={styles.gameForPc}>
              <i className="fas fa-desktop"></i> Acesse somente pelo computador
            </div>
            
          </main>
        </div>

        {/* <div className={`${styles.row} ${styles.carousel}`}>
          <Carousel>
            {clients}
          </Carousel>
        </div> */}

      </div>
    </div>
  )
}