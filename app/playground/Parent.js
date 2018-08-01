import React from 'react'
import Child from './Child'

export default class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: null
    }
    this.onOneClik = this.onOneClik.bind(this);
    this.onTwoClik = this.onTwoClik.bind(this);
    this.onThreeClik = this.onThreeClik.bind(this);
  }
  onOneClik(e) {
    this.setState({ tab: '1' });
  }
  onTwoClik(e) {
    this.setState({ tab: '2' });
  }
  onThreeClik(e) {
    this.setState({ tab: '3' });
  }
  render() {
    return (
      <div>
        <div>
          <button type="button" onClick={this.onOneClik}>1</button>
          <button type="button" onClick={this.onTwoClik}>2</button>
          <button type="button" onClick={this.onThreeClik}>3</button>
        </div>
        <div>
          <Child tab={this.state.tab} />
        </div>
      </div>
      
    );
  }
}