import React from 'react'
import useSound from 'use-sound'

export default function Button( props ) {

    const audioUrl = props.audio ? props.audio : "https://branching-stories.s3.amazonaws.com/audio/click-v1.mp3"
	const [audioClick] = useSound(audioUrl, {volume:0.6})
    const btnDisabled = props.disabled ? props.disabled : ''
    const btnClass = props.className ? props.className : "btn btn-primary my-button"
    const content = props.children ? props.children : 'Confirmar'

    function btnOnclick(){
        audioClick()
        if( props.onClick ){
            props.onClick()
        }
    }

	return (<div>

        <button 
            id={props.id ? props.id : null}
            disabled={btnDisabled}
            onClick={()=>btnOnclick()}
            className={btnClass}>
                {content}
        </button>
		
    </div>)
}