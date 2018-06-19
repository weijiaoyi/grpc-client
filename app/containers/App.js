// @flow
import * as React from 'react';
import style from '../styles/native.scss';
import { remote } from 'electron';

import WinControl from '../components/WindowControl';

type Props = {
  children: React.Node
};

export default class App extends React.Component<Props> {
  props: Props;
  
  render() {

    const { BrowserWindow } = window.require('electron').remote;;

    return <div>
      <div className={style.titleBar}>
        Project Companion
        <div className={style.controlBar}>
          <WinControl window={BrowserWindow.getFocusedWindow()}/>
        </div>
      </div>
      <div>
        {this.props.children}
      </div>
    </div>;
  }
}
