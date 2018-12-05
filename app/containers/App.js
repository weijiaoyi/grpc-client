// @flow
import * as React from 'react';
import 'normalize.css';
import style from '../styles/style.scss';
import { remote } from 'electron';

import WinControl from '../components/WindowControl';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;
  
  render() {

    const { BrowserWindow } = window.require('electron').remote;

    return <div>
      <div className={style.titleBar}>
        Dev Companion
        <div className={style.controlBar}>
          <WinControl window={remote.getCurrentWindow()}/>
        </div>
      </div>
      <div className={style.app}>
        {this.props.children}
      </div>
    </div>;
  }
}
