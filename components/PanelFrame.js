import React, {useState} from 'react'
import styles from '../styles/PanelFrame.module.css'
import Modal from './Modal'
import Store from './Store'
import Button from './Button'
import Inventory from './Inventory'

export default function PanelFrame(props){

    const fases = props.fases
    const currentFase = props.currentFase
    const storeItems = props.storeItems
    const user = props.user
    const wallet = props.wallet

    //console.log('PanelFrame -> ',storeItems)

    const [modalInventory, setModalInventory] = useState(false)
    const [modalHelp, setModalHelp] = useState(false)

    let fasesSolved = 0

    fases?.map((item)=>{
        if( item.solved == true ){
            fasesSolved++
        }
    })

    const faseBarImg = `https://branching-stories.s3.amazonaws.com/mapa/Barra0${fasesSolved}.png`

    return(<div>

        <div className={styles.panelFrame}>

            <div className={styles.buttons}>
                <Button
                    onClick={()=>props.changeStoreModal(true)} 
                className="btn btn-primary btnLoja block"><img src="https://branching-stories.s3.amazonaws.com/shopping-cart.png"/>Loja</Button>

                <Button
                    onClick={()=>setModalInventory(true)} 
                className="btn btn-primary btnInventario block"><img src="https://branching-stories.s3.amazonaws.com/backpack.png"/>Inventário</Button>

                <Button
                    onClick={()=>setModalHelp(true)} 
                className="btn btn-primary block"><img src="https://branching-stories.s3.amazonaws.com/question.png"/>Ajuda</Button>
            </div>

            <div className={styles.faseBar}>
                <img src={faseBarImg}/>
            </div>

        </div>

        <Modal 
            show={props.storeModal}
            onHide={()=>props.changeStoreModal(false)}
            className="modal-xl store"
            >
            <Store 
                user={user} 
                wallet={wallet} 
                changeStoreModal={props.changeStoreModal} 
                changeInventory={props.changeInventory} 
                storeItems={storeItems}
                changeStore={props.changeStoreItems}
                setAlternativesLoading={props.setAlternativesLoading}
            />
            <Button
            onClick={()=>props.changeStoreModal(false)} 
            className="btn btn-primary section-modal-btn btn-fechar">
                <img src="https://branching-stories.s3.amazonaws.com/btn-fechar.png"/>
            </Button>
        </Modal>

        <Modal 
            show={modalInventory}
            onHide={()=>setModalInventory(false)}
            className="modal-xl smaller inventory"
            >
            <Inventory user={user} items={props.inventoryItems} />
            
            <Button
            onClick={()=>setModalInventory(false)} 
            className="btn btn-primary section-modal-btn btn-fechar">
                <img src="https://branching-stories.s3.amazonaws.com/btn-fechar.png"/>
            </Button>
        </Modal>

        <Modal 
            show={modalHelp}
            onHide={()=>setModalHelp(false)}
            className="modal-xl smaller blank"
            >
            
            <p>Atenção, você agora está se aventurando no universo de Solarium. Neste jogo você terá uma série de desafios e deve tomar decisões que julgar ser a melhor escolha naquele contexto. Preste atenção aos recursos que irá utilizar em sua jornada:</p>
            <p><i className="fas fa-coins"></i><span style={{marginLeft:'6px'}}>Toda decisão tomada tem um custo em Pakz(PZ$), a moeda utilizada neste universo. Portanto, pense bem antes de responder, pois ao final você deve ter sua carteira com o máximo possível de RECURSOS que puder.</span></p>
            <p><i class="fas fa-file-alt"></i><span style={{marginLeft:'6px'}}>Você também deve fechar o máximo possível de contratos que conseguir em sua jornada, que serão obtidos ao longo da sua jornada. Você inicia sua jornada com 10.000 Pakz na sua CARTEIRA e 2 CONTRATOS, recursos que ganhou da Solarium para iniciar sua jornada.</span></p>
        
            <p><i style={{marginRight:'6px'}} class="fas fa-shopping-cart"></i>Em alguns desafios terão opções de decisão bloqueadas, e para desbloqueá-las você deve ir até a loja e comprar o item indicado na opção. Se ficar com alguma dúvida sobre o jogo, a qualquer momento clique no botão "Ajuda" e você poderá ler novamente estas informações.</p>

            <p>Após finalizar as missões, você poderá ver sua pontuação final e seguir para o seu relatório.</p>

            {/* <p>Neste jogo você terá uma série de desafios e deve tomar decisões que julgar ser a melhor escolha naquele contexto. Toda decisão tomada tem um custo em Pakz(PZ$), a moeda utilizada neste universo. Tanto a resposta errada como a correta tem um custo, pois afinal mesmo avançando ainda temos que investir tempo e dinheiro para atingir o sucesso nessa jornada. Portanto, pense bem antes de responder, pois ao final você deve ter sua carteira com o máximo possível de RECURSOS que puder. Você também deve fechar o máximo possível de CONTRATOS que conseguir em sua jornada, que serão obtidos tomando a decisão certa na hora certa. Em algumas etapas do jogo se você tomar uma decisão incorreta, poderá perder um contrato, mas mesmo assim deverá voltar e responder o desafio corretamente para seguir adiante. Você inicia a sua jornada com 10.000 Pakz na sua CARTEIRA e 2 CONTRATOS, recursos que ganhou da Solarium para iniciar sua Jornada.</p>
            <p>Finalize as missões o mais rápido que puder, pois caso haja empate na pontuação entre os jogadores, o tempo será o critério de desempate e aquele que for mais rápido irá levar vantagem.</p>
            <p>Em alguns desafios terão opções de decisão bloqueadas, e para desbloqueá-las você deve ir até a loja e comprar o item indicado na opção.</p>
            <p>Após finalizar as missões, você poderá ver sua pontuação final e seguir para o questionário. Preencher o questionário também irá contar pontos, e quem não preencher ficará de fora da competição.</p>
            <p>Qualquer dúvida você pode entrar em contato, pelo whatsapp, pelos seguintes números: (51)981.285.704 ou (51)981.101.419 </p> */}
            
            <Button
            onClick={()=>setModalHelp(false)} 
            className="btn btn-primary section-modal-btn btn-fechar">
                <img src="https://branching-stories.s3.amazonaws.com/btn-fechar.png"/>
            </Button>
        </Modal>

    </div>)

}