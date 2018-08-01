/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import { NavLink } from 'react-router-dom';
import App from './containers/App';
import GrpcRender from './containers/GrpcRender';
import Home from './containers/Home';
import style from './styles/style.scss';
import classNames from 'classnames'

/* Web only for now */
export default (props) => (
  <App>
    <div className={style.sidebar}>
      <NavLink to={"/"} activeClassName={style.active} className={style['nav-link']} exact={true}>{"Home"}</NavLink>
      <NavLink to={"/grpc"} activeClassName={style.active} className={style['nav-link']} exact={true}>{"GRPC Client"}</NavLink>
    </div>
    <div className={classNames(style.container, style['container--main'])}>
      <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/grpc" exact={true} component={GrpcRender} />
        <Route path="/converter" exact={true} component={GrpcRender} />
      </Switch>
    </div>
  </App>
);
