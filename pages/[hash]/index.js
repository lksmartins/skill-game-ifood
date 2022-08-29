import React from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/Start.module.css'
import TimerButton from '../../components/TimerButton'
import HtmlParser from 'react-html-parser'
import Carousel from '../../components/Carousel'

export async function getServerSideProps(context) {

    const { hash } = context.query

	const res = await fetch( process.env.API_URL, {
		method: 'POST',
		body: JSON.stringify({ 
			token: process.env.API_KEY, 
			action: 'getThemeStory',
            hash: hash // group hash
		})
	})

	const response = await res.json()
	
	return {
		props: {
            theme: response.data, 
            hash: hash,
            isIhunter: context.req.url.includes('ihunter')
        }
	}
}

export default function Start( props ) {

    const router = useRouter()
    const theme = props.theme
    const isIhunter = props?.isIhunter || false
    console.log("🚀 ~ file: index.js ~ line 37 ~ Start ~ isIhunter", isIhunter)

    let text0

    let text1
    text1  = '<p>O universo está em constante expansão e da mesma forma está a Solarium - Administradora de Planetas, a maior e melhor empresa de comercialização de planetas da via láctea. Parabéns, você foi selecionado para ser o mais novo franqueado da Solarium.</p>'
    text1 += '<p>Seres de todas as partes estão vindo até a Solarium em busca de novos planetas para seus povos habitarem e contam com você para entregar a melhor experiência. A Solarium é reconhecida por entregar planetas de alto padrão, tendo uma ampla gama de planetas para as mais variadas necessidades: desde planetas básicos, até os mais sofisticados. O cliente pode também escolher quais módulos e opcionais quer agregar ao seu planeta, tais como: lua, sol, satélite, oceanos, montanhas, edificações e etc. A clientela além de diversa é bastante exigente, por isso somente os melhores profissionais como você, fazem parte da estratégia da Solarium.</p>'
    text1 += '<p>Você deverá colocar em prática o plano de expansão da melhor forma que puder, e para isso você deve:</p>'
    text1 += '<ul>'
        text1 += '<li>Preparar os planetas inabitados para receber novos inquilinos.</li>'
        text1 += '<li>Eliminar as ameaças (há uma terrível ameaça de Vorbes na Via Láctea, uma praga que gosta de comer tudo que vê pela frente nos planetas).</li>'
        text1 += '<li>Dar o melhor atendimento possível àqueles que já são clientes e fechar o máximo possível de novos contratos, pois os clientes não param de chegar.</li>'
    text1 += '</ul>'

    let text2 = '<p>O objetivo desta jornada é você completar três missões, em que você deverá tomar decisões e saber usar os seus recursos para  buscar fechar o máximo de contratos e expandir sua franquia da Solarium. Você deve completar todas as missões e responder um questionário ao final, o qual ajudará a Solarium a planejar o seu melhor plano de desenvolvimento.</p>'
    text2 += '<ul>'
    text2 += '<li>A previsão de conclusão das 3 missões é de em média 30 minutos.</li>'
    text2 += '<li>Utilize o navegagor Google Chrome para acessar o jogo.</li>'
    text2 += '<li>A primeira etapa é conhecermos um pouco mais sobre o seu perfil. Clique na tela para prosseguir com algumas perguntas iniciais para criar seu avatar e a qual grupo ele pertence.</li>'
    text2 += '</ul>'

    let items = [
        text1,
        text2
    ]

    let indexForButton = 1
    let addressToPush = `/${props.hash}/profile`
    
    addressToPush = `/${props.hash}/pre-missao`

    if( props.hash == 'ihunter' || isIhunter ){
        text0 = '<p>Seja bem-vindo ao jogo de análise de habilidades “Solarium, a Jornada do Sucesso”. A seguir você será apresentado a uma série de desafios, que colocarão suas habilidades à prova, ao final lhe apresentaremos um relatório com seu desempenho. Não existe resposta certa ou errada, são apenas situações hipotéticas onde desejamos conhecer um pouco mais das suas habilidades. O primeiro passo é você conhecer um pouco da história do Solarium, para isso preparamos o vídeo acima, depois de assistir ao vídeo, clique na seta abaixo e à direita para prosseguir e leia um pouco mais sobre esse novo universo que é o Solarium.</p>'
        text0 += '<p><b>Importante:  Utilize o navegador Google Chrome para prosseguir.</b></p>'

        text1  = '<p>O universo está em constante expansão e da mesma forma está a Solarium - Administradora de Planetas, a maior e melhor empresa de comercialização de planetas da via láctea. Parabéns, você foi selecionado para ser o mais novo franqueado da Solarium.</p>'
        text1 += '<p>Seres de todas as partes estão vindo até a Solarium em busca de novos planetas para seus povos habitarem e contam com você para entregar a melhor experiência. A Solarium é reconhecida por entregar planetas de alto padrão, tendo uma ampla gama de planetas para as mais variadas necessidades: desde planetas básicos, até os mais sofisticados. O cliente pode também escolher quais módulos e opcionais quer agregar ao seu planeta, tais como: lua, sol, satélite, oceanos, montanhas, edificações e etc. A clientela além de diversa é bastante exigente, por isso somente os melhores profissionais como você, fazem parte da estratégia da Solarium.</p>'
        text1 += '<p>Você deverá colocar em prática o plano de expansão da melhor forma que puder, e para isso você deve:</p>'
        text1 += '<ul>'
            text1 += '<li>Preparar os planetas inabitados para receber novos inquilinos.</li>'
            text1 += '<li>Dar o melhor atendimento possível àqueles que já são clientes e fechar o máximo possível de novos contratos, pois os clientes não param de chegar.</li>'
        text1 += '</ul>'

        text2 = '<p>O objetivo desta jornada é você completar as missões, em que você deverá tomar decisões e saber usar os seus recursos para buscar fechar o máximo de contratos e expandir sua franquia da Solarium.</p>'
        text2 += '<ul>'
        text2 += '<li>A previsão de conclusão das missões é de 5 a 10 minutos.</li>'
        text2 += '<li>Utilize o navegagor Google Chrome para acessar o jogo.</li>'
        text2 += '</ul>'

        indexForButton = 2
        addressToPush = `/ihunter/${props.hash}/pre-missao`
        
        items = [
            text0,
            text1,
            text2
        ]
    }

	return (<div className={styles.bg}>

        <div className={styles.container}>

            <div className={styles.video}>
                
                <p>Assista o vídeo abaixo: <i className="fas fa-arrow-circle-down"></i></p>

                <video
                    id="my-player"
                    className="video-js"
                    controls
                    preload="auto"
                    poster="https://branching-stories.s3.amazonaws.com/SOLARIUM_720.jpg"
                    >
                    <source src="https://branching-stories.s3.amazonaws.com/main_video.mp4" type="video/mp4"></source>
                    <p className="vjs-no-js">
                        Seu navegador não suporta esse vídeo. Considere atualizar para um navegador que
                        <a href="https://videojs.com/html5-video-support/" target="_blank">
                            suporte HTML 5.
                        </a>
                    </p>
                </video>
            </div>

            <div className={styles.main}>
                
                <div className={styles.title}>
                    {theme?.description}
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
                        <div key={index} className={`master ${styles.sliderItem}`}>
                            { HtmlParser(item) }
                            { index == indexForButton ? <div className={styles.confirm}>
                                <TimerButton onClick={()=>router.push(addressToPush)} start={true} time={5}>Iniciar Minha Jornada</TimerButton>
                            </div> : null }
                        </div>
                    )
                    }
                </Carousel>           

            </div>

        </div>

		
    </div>)
}