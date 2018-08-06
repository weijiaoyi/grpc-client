import React from 'react';

export default class JsonHelper extends React.Component{

  state = {
    escapeToggle: true,
    toBeautify: false,
    inputText: "",
    result: "",
  }

  handleChange = (e) => {
    this.setState({inputText: e.target.value});
    e.preventDefault();
  }

  handleSubmit = (e) => {

    const {escapeToggle} = this.state;

    if(escapeToggle){
      this.setState({
        result: JSON.stringify(this.state.inputText)
      })
    }else{
      this.setState({
        result: JSON.parse(this.state.inputText).toString()
      })
    }

    e.preventDefault();
  }

  handleEscapeToggle = (e) => {
    this.reset();
    this.setState({
      escapeToggle: !this.state.escapeToggle
    });
  }

  beautifyJson = (e) => {
    this.setState({
      toBeautify: !this.state.toBeautify,
    }, () => {
      this.setState({
        result: this.syntaxHighlight(this.state.result, this.state.toBeautify)
      })}
    );
    e.preventDefault();
  }

  reset = (e) => {
    this.setState({
      inputText: "",
      result: ""
    });
  }

  syntaxHighlight = (json, toBeautify) => {
    try{
      if(typeof json != 'object'){
        json = JSON.parse(json);
      }
      if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
        if(!toBeautify) json = JSON.stringify(json);
      }
      return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      // else return json.replace('&amp;',/&/g).replace('&lt;', /</g).replace('&gt;', />/g);
    }
    catch(err){
      Console.log(err);
      return json;
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>
            To Escape
            <input type='checkbox' onClick={this.handleEscapeToggle} defaultChecked={this.state.escapeToggle}/>
          </label>
        </div>
        <br/>
        <div>
          <label>
            Enter string value:
            <br/>
            <textarea 
              rows="10" cols="100"
              value={this.state.inputText} 
              onChange={this.handleChange} 
              placeholder={`Enter string to ${this.state.escapeToggle ? "escape" : "unescape"}.`}
            />
          </label>
        </div>
        <br/>
        <div>
          <strong style={{paddingRight: 25}}>Result</strong>
          <button hidden={this.state.escapeToggle} disabled={!this.state.result} 
            onClick={this.beautifyJson}>
            {this.state.toBeautify ? "Uglify" : "Beautify"}
          </button>
          <hr/>
          <br/>
          {
            this.state.escapeToggle
            ?
            <textarea 
              disabled={true}
              rows="10" cols="100"
              value={this.state.result}
            />
            :
            <pre style={{width: 623, minHeight: 138, backgroundColor: '#111', margin: 0}}>
              {this.state.result}
            </pre>
          }
          {/* style={{width: 623, minHeight: 138, backgroundColor: '#111', margin: 0}} */}
        </div>
        <br/>
        <div>
          <button type="submit">Submit</button>
          <button onClick={this.reset}>Clear</button>
        </div>
      </form>
    );
  }

}