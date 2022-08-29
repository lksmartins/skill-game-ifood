import React, { useState, useEffect } from "react"
import { useRouter } from 'next/router'
import Popup from './Popup'

const useAudio = (url="https://branching-stories.s3.amazonaws.com/bs_soundtrack.mp3",volume=0.2) => {
  //const [audio] = useState(new Audio(url))

  const router = useRouter()

  // soundtrack
  const [audio] = useState(typeof Audio !== "undefined" && new Audio(url))
  const [playing, setPlaying] = useState(false)

  // sfx
  const [sfxVictory] = useState(typeof Audio !== "undefined" && new Audio('https://branching-stories.s3.amazonaws.com/audio/celebration_sfx.mp3'))
  const [sfxApplause] = useState(typeof Audio !== "undefined" && new Audio('https://branching-stories.s3.amazonaws.com/audio/applause_sfx.mp3'))
  
  const toggle = () => setPlaying(!playing)

  useEffect(() => {

      audio.volume = volume
      playing ? audio.play() : audio.pause()

  }, [playing])

  // runs once
  useEffect(() => {

    audio.addEventListener('ended', () => { 
        audio.currentTime = 0
        audio.play()
        setPlaying(true)
    })

    sfxVictory.addEventListener('ended', () => { 
      sfxVictory.currentTime = 0
    })

    sfxApplause.addEventListener('ended', () => { 
      sfxApplause.currentTime = 0
    })

    return () => {
      audio.removeEventListener('ended', () =>{ audio.currentTime = 0; setPlaying(true); })
    }

  }, [])

  // runs everytime that route changes
  useEffect(() => {

    if( ['/[hash]/obrigado', '/[hash]/fase/[faseId]/review', '/[hash]/profile/[teamId]'].includes(router.pathname) ){
      sfxVictory.volume = 0.6
      sfxVictory.play()
    }

    if( router.pathname == '/[hash]/review' ){
      sfxApplause.volume = 0.6
      sfxApplause.play()
    }

  }, [router])

  return [playing, toggle]
};

const Player = ({ url, volume }) => {

  const [playing, toggle] = useAudio(url,volume)

  // popup
  const router = useRouter()
  const [popupToggle, setPopupToggle] = useState(router.pathname=="/[hash]/profile" && !playing ? true : false)
  const popupAction = ()=>{
      setPopupToggle(false)
      toggle()
  }

  useEffect(() => {

    setPopupToggle(router.pathname=="/[hash]/profile" && !playing ? true : false)

  },[router])

  return (
    <div>

      <Popup
          toggle={popupToggle}
          setToggle={setPopupToggle}
          content="Agora chegou a hora de você escolher o seu avatar e responder algumas perguntas para definirmos o seu time!"
          action={popupAction}
          btnText="Continuar"
      />

      <button className="btn btn-primary" onClick={toggle}>{playing ? <><i className="fas fa-pause"></i> Pause</> : <><i className="fas fa-play"></i> Play</>}</button>

    </div>
  )
}

export default Player