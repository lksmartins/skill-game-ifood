import React, {useState} from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/PreMissao.module.css'
import TimerButton from '../../components/TimerButton'
import Carousel from '../../components/Carousel'
import HtmlParser from 'react-html-parser'

export async function getServerSideProps(context) {
	
	return {
		props: {
            hash: context.query.hash,
            isIhunter: context.req.url.includes('ihunter')
		}
	}
}

export default function PreGame(props) {
    
    const router = useRouter()
    const { hash, isIhunter } = props

    const [loadingPage, setLoadingPage] = useState(null)

    function goToGame(){

        setLoadingPage(<i className="fas fa-spin fa-spinner"></i>)
        const pathToPush = isIhunter ? `/ihunter/${hash}/fases` : `/${hash}/fases`
        router.push(pathToPush)

    }

    const teamClass = 'teamOne'

    let text1
    text1 = '<p>Atenção, você está prestes a começar sua aventura no universo de Solarium. Neste jogo você terá uma série de desafios e deve tomar decisões que julgar ser a melhor escolha naquele contexto. Preste atenção aos recursos que irá utilizar em sua jornada:</p>'
    text1 += '<p><div><i class="fas fa-coins"></i></div><span>Toda decisão tomada tem um custo em Pakz(PZ$), a moeda utilizada neste universo. Tanto a resposta errada como a correta tem um custo, pois afinal mesmo avançando ainda temos que investir tempo e dinheiro para atingir o sucesso nessa jornada. Portanto, pense bem antes de responder, pois ao final você deve ter sua carteira com o máximo possível de RECURSOS que puder.</span></p>'

    let text2
    text2 = '<p><div><i class="fas fa-file-alt"></i></div><span>Você também deve fechar o máximo possível de CONTRATOS que conseguir em sua jornada, que serão obtidos tomando a decisão certa na hora certa. Em algumas etapas do jogo se você tomar uma decisão incorreta, poderá perder um contrato, mas mesmo assim deverá voltar e responder o desafio corretamente para seguir adiante. Você inicia a sua jornada com 10.000 Pakz na sua CARTEIRA e 2 CONTRATOS, recursos que ganhou da Solarium para iniciar sua Jornada.</span></p>'
    text2 += '<hr/>';
    text2 += '<p><div><i class="fas fa-shopping-cart"></i></div>Em alguns desafios terão opções de decisão bloqueadas, e para desbloqueá-las você deve ir até a loja e comprar o item indicado na opção. Se ficar com alguma dúvida sobre o jogo, a qualquer momento clique no botão (?) e você poderá ler novamente estas informações.</p>'

    let text3
    text3 = '<p><div><i class="fas fa-hourglass-half"></i></div>Finalize as missões o mais rápido que puder, pois caso haja empate na pontuação entre os jogadores, o tempo será o critério de desempate e aquele que for mais rápido irá levar vantagem.</p>'
    text3 += '<hr/>'
    text3 += '<p>Após finalizar 3 missões, você poderá ver sua pontuação final e seguir para o questionário. Preencher o questionário também irá contar pontos, e quem não preencher ficará de fora da competição.</p>'
    text3 += '<p>Clique em avançar para escolher sua primeira missão.</p>'

    if( hash == 'ihunter' || isIhunter ){

        text1 = '<p>Atenção, você está prestes a começar sua aventura no universo de Solarium. Neste jogo você terá uma série de desafios e deve tomar decisões que julgar ser a melhor escolha naquele contexto. Preste atenção aos recursos que irá utilizar em sua jornada:</p>'
        text1 += '<p><div><i class="fas fa-coins"></i></div><span>Toda decisão tomada tem um custo em Pakz(PZ$), a moeda utilizada neste universo. Portanto, pense bem antes de responder, pois ao final você deve ter sua carteira com o máximo possível de RECURSOS que puder.</span></p>'

        text2 = '<p><div><i class="fas fa-file-alt"></i></div><span>Você também deve fechar o máximo possível de contratos que conseguir em sua jornada, que serão obtidos ao longo da sua jornada. Você inicia sua jornada com 10.000 Pakz na sua CARTEIRA e 2 CONTRATOS, recursos que ganhou da Solarium para iniciar sua jornada.</span></p>'
        text2 += '<hr/>';
        text2 += '<p><div><i class="fas fa-shopping-cart"></i></div>Em alguns desafios terão opções de decisão bloqueadas, e para desbloqueá-las você deve ir até a loja e comprar o item indicado na opção. Se ficar com alguma dúvida sobre o jogo, a qualquer momento clique no botão "Ajuda" e você poderá ler novamente estas informações.</p>'

        text3 = '<p>Após finalizar as missões, você poderá ver sua pontuação final e seguir para o seu relatório.</p>'
        text3 += '<p>Clique em avançar para escolher sua primeira missão.</p>'

    }

    const items = [
        text1,
        text2,
        text3
    ]

	return (<div className={teamClass+' '+styles.bg}>

        <div className={styles.container}>

            <div className={styles.main}>

                <div className={styles.title}>
                    Solarium - A Jornada do Sucesso
                </div>

                <Carousel settings={ {
                    dots: true,
                    infinite: false,
                    speed: 500,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true,
                    className: 'contentSlider '+styles.contentSlider
                    } }>
                    {
                    items?.map((item, index)=>
                        <div className={`master ${styles.sliderItem}`}>
                            { HtmlParser(item) }
                            { index == 2 ? <div className={styles.confirm}>
                                <TimerButton onClick={()=>goToGame()} start={true} time={5}>Avançar</TimerButton>
                                <div className={styles.loader}>
                                    {loadingPage}
                                </div>
                            </div> : null }
                        </div>
                    )
                    }
                </Carousel>

                <img src="https://branching-stories.s3.amazonaws.com/Robo%402x.png"/>

            </div>

        </div>

		
    </div>)
}