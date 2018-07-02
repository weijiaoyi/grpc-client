import React from 'react';
import style from '../styles/native.scss';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faMinimize from '@fortawesome/fontawesome-free-solid/faWindowMinimize'
import faMaximize from '@fortawesome/fontawesome-free-solid/faSquare'
import faClose from '@fortawesome/fontawesome-free-solid/faTimes'

export default (props) => {

  const minimizeWindow = () => {
    props.window.minimize();
  }
  
  const maximizeWindow = () => {
    if(props.window.isMaximized()) props.window.unmaximize();
    else props.window.maximize();
  }
  
  const closeWindow = () => {
    props.window.close();
  }

  return (
    <div className={style.controlBar}>
      <button className={style.controlButton} onClick={minimizeWindow}>
        <FontAwesomeIcon icon={faMinimize}/>
      </button>

      <button className={style.controlButton} onClick={maximizeWindow}>
        <FontAwesomeIcon icon={faMaximize}/>
      </button>

      <button className={classNames(style.controlButton, style.close)} onClick={closeWindow}>
        <FontAwesomeIcon icon={faClose}/>
      </button>
    </div>
  )
}
  