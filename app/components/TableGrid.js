import React, { Component } from 'react';
import style from '../styles/style.scss'
import classNames from 'classnames';

export default class TableGrid extends Component {

  constructor(){
    super();
    const defaultConfig = { 
      rows: [
        {
          'Key': 'btt',
          'Value': '1'
        }
      ],
      headers: [{
        id: 'Key',
        name: 'Key'
      }, {
        id: 'Value',
        name: 'Value'
      }],
      editable: true
    }

    this.config = {
      ...defaultConfig,
      ...this.props
    }
  
    this.state = {
      rowData: this.config.rows
    }
  }

  onInputFocusOut = (tracker) => {

    console.log(tracker);
    //@todo: get rows index and modify its value. this.setState

    

    this.props.onFieldChanged()
  }

  render = () => {

    const { headers, rows, editable } = this.config;

    return (
      <div>
        <table className={classNames(style.table, style['equal-width'])}>
          <thead className={style.table}>
            <tr>
            { headers.length > 0 && headers.map((header, index) => {
              return <th key={header.name}>{header.name}</th>
            })}
            </tr>
          </thead>
          <tbody>
            { rows.length > 0 && rows.map((row, index) => {
              return (
              <tr>
              { headers.length > 0 && headers.map(header => {
                  return <td key={rows[index][header.id]}>
                    {
                      !editable
                      ?
                      rows[index][header.id]
                      :
                      <input
                        defaultValue={rows[index][header.id]}
                        onBlur={(e) => this.onInputFocusOut({
                          rowIndex: index,
                          rowKey: header.id,
                          newValue: e.target.value,
                          oldValue: rows[index][header.id]
                        })}
                      />
                    }
                  </td>
                }
              )}
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

TableGrid.defaultProps = {
  onFieldChanged: () => {}
}