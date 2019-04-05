/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import { NavLink } from 'react-router-dom';
import App from './containers/App';
import GrpcRender from './containers/GrpcRender';
import JsonHelper from './containers/JsonHelper';
import Charfer from './containers/Charfer';
import Home from './containers/Home';
import Spinner from './containers/Spinner';
import Socket from './containers/Socket';

import style from './styles/style.scss';
import classNames from 'classnames'

/* Web only for now */
export default (props) => (
  <App>
    <div className={style.sidebar}>
      <NavLink to={"/"} activeClassName={style.active} className={style['nav-link']} exact={true}>{"Home"}</NavLink>
      <NavLink to={"/grpc"} activeClassName={style.active} className={style['nav-link']} exact={true}>{"GRPC Client"}</NavLink>
      <NavLink to={"/jsonhelper"} activeClassName={style.active} className={style['nav-link']} exact={true}>{"JSON Helper"}</NavLink>
      {/* <NavLink to={"/charfer"} activeClassName={style.active} className={style['nav-link']} exact={true}>{"Charfer (WIP)"}</NavLink> */}
      <NavLink to={"/spinner"} activeClassName={style.active} className={style['nav-link']} exact={true}>{"Spinner"}</NavLink>
      <NavLink to={"/socket"} activeClassName={style.active} className={style['nav-link']} exact={true}>{"Socket"}</NavLink>
    </div>
    <div className={classNames(style.container, style['container--main'])}>
      <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/grpc" exact={true} component={GrpcRender} />
        <Route path="/jsonhelper" exact={true} component={JsonHelper} />
        {/* <Route path="/charfer" exact={true} component={Charfer} /> */}
        <Route path="/spinner" exact={true} component={Spinner} />
        <Route path="/socket" exact={true} component={Socket} />
      </Switch>
    </div>
  </App>
);
