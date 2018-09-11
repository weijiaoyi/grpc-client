import React from 'react';
import style from '../styles/style.scss';

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
      let parsed = JSON.parse(this.state.inputText);
      if(typeof parsed === "object") parsed = this.state.inputText;
      this.setState({
        result: this.syntaxHighlight(parsed, this.state.toBeautify)
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
      result: "",
      toBeautify: false
    });
  }

  syntaxHighlight = (json, toBeautify) => {
    try{
      if(toBeautify){
        json = JSON.stringify(JSON.parse(json), undefined, 2);
        return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      else
      {
        json = JSON.stringify(JSON.parse(json));
        return json;
      }
    }
    catch(err){
      return json;
    }
  }

  render() {

    let canBeautify = !!this.state.result;
    let parsedResult = undefined;

    if(this.state.result){
      try
      {
        parsedResult = JSON.parse(this.state.result);
        canBeautify = canBeautify && !!(typeof parsedResult === "object");
      }
      catch(err){
        canBeautify = false;
      }
    }


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
          <button hidden={this.state.escapeToggle} 
            disabled={!canBeautify} 
            className={style['button']}
            onClick={this.beautifyJson}>
            {this.state.toBeautify ? "Serialized" : "Beautify"}
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
            <pre style={{overflowY: 'auto', width: 623, minHeight: 138, backgroundColor: '#111', margin: 0}}>
              {this.state.result}
            </pre>
          }
          {/* style={{width: 623, minHeight: 138, backgroundColor: '#111', margin: 0}} */}
        </div>
        <br/>
        <div className={style['buttons']}>
          <button className={style['button']} type="submit">Submit</button>
          <button className={style['button']} type="button" onClick={this.reset}>Clear</button>
        </div>
      </form>
    );
  }

}