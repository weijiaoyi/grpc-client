import React from 'react';
import style from '../styles/style.scss';
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faClose from '@fortawesome/fontawesome-free-solid/faTimes';

export default (props) => (
  <div>
    <div className={classNames(props.className, 
        style['item'],
        props.isActive && style['active'], 
        props.onClick && classNames(style['text-not-selectable'], style['clickable']),
      )}
      onClick={props.onClick}
    >
      {props.children}
      { props.onRemove && 
      <div 
        className={style['item-cross-sign']}
        onClick={(e) => {
          props.onRemove();
          e.stopPropagation();
        }}
      >
        <FontAwesomeIcon icon={faClose}/>
      </div>
      }
    </div>
  </div>
)