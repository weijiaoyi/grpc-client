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
    props.window.maximize();
  }
  
  const closeWindow = () => {
    props.window.close();
  }

  return (
    <div>
      <button className={classNames(style.controlBar, style.controlButton)} onClick={minimizeWindow}>
        <FontAwesomeIcon icon={faMinimize}/>
      </button>

      <button className={classNames(style.controlBar, style.controlButton)} onClick={maximizeWindow}>
        <FontAwesomeIcon icon={faMaximize}/>
      </button>

      <button className={classNames(style.controlBar, style.controlButton)} onClick={closeWindow}>
        <FontAwesomeIcon icon={faClose}/>
      </button>
    </div>
  )
}
  