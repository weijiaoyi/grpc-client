import React from 'react';

import style from '../styles/style.scss';

const Card = props => {
  return (
    <div className={style['card']}>
      {props.children}
    </div>
  );
};

export default Card;