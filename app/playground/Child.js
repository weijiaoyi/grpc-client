import React from 'react'

class Child extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: this.props.tab
    }
  }
  render() {
    let text;

    if (this.props.tab === '1') {
      text = <div>text 1 </div>
    } else if (this.props.tab === '2') { 
      text = <div>text 2 </div>
    } else if (this.props.tab === '3') {
      text = <div>text 3 </div>
    }
  return (
    <div>
      {text}
    </div>
    );
  } 
}

export default Child;