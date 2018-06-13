/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import { NavLink } from 'react-router-dom';
import App from './containers/App';
import GrpcRender from './containers/GrpcRender';
import style from './styles/style.scss';

/* Web only for now */
export default () => (
  <App>
    <div className={style.sidebar}>
      <NavLink to={"/test"} activeClassName="active" exact={true}>{"Test"}</NavLink>
    </div>
    <div className={style['container--main']}>
      <Switch>
        <Route path="/" component={GrpcRender} />
      </Switch>
    </div>
  </App>
);
