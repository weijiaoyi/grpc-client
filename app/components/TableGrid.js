import React, { Component } from 'react';
import style from '../styles/style.scss'
import classNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle';

export default class TableGrid extends Component {

  componentWillReceiveProps(nextProps) {
    this.setState({ 
      rows: nextProps.rows,
      headers: Object.getOwnPropertyNames(nextProps.rows[0]).map(propName => {
        return {
          id: propName,
          name: propName
        }
      }),
    });  
  }

  state = {
    rows: this.props.rows,
    headers: Object.getOwnPropertyNames(this.props.rows[0]).map(propName => {
      return {
        id: propName,
        name: propName
      }
    }),
    editable: this.props.editable,
    addable: this.props.addable
  }

  updateRowData = (index, key, newData) => {

    var newRowsData = [...this.state.rows];
    newRowsData[index][key] = newData;

    //@todo: get rows index and modify its value. this.setState
    this.setState({
      rows: newRowsData
    });
    this.props.onFieldChanged(newRowsData)
  }

  getRowData = (index) => {
    return this.state.rows[index];
  }

  addRow = () => {
    var emptyRow = this.getRowTemplate();
    let {rows} = this.state;

    if(this.EmptyRowCount() < 1){
      this.setState({
        rows: [...rows, emptyRow]
      })
    }
  }

  getRowTemplate = () => this.state.headers.reduce((o, header) => ({ ...o, [header.id]: ''}), {});

  EmptyRowCount = () => this.state.rows.filter((row) => JSON.stringify(row) === JSON.stringify(this.getRowTemplate())).length;

  render = () => {

    const { headers, rows, editable, addable } = this.state;

    return (
      <div>
        <table className={classNames(style.tableGrid, style['equal-width'])}>
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
              <tr key={index}>
              { headers.length > 0 && headers.map(header => {

                let { value, className } = row[header.id];

                return <td key={[header.id]} className={className}>
                  {
                    !editable
                    ?
                    value
                    :
                    <input
                      defaultValue={value}
                      onBlur={(e) => this.updateRowData(index, [header.id], { value: e.target.value })}
                    />
                  }
                </td>
              })}
              </tr>
              )
            })}
          </tbody>
        </table>
        {
          addable &&
          <button style={{'float': 'right'}} className={style.button} onClick={this.addRow}>
            <FontAwesomeIcon icon={faPlusCircle}/> Add
          </button>
        }
      </div>
    )
  }
}

TableGrid.defaultProps = {
  onFieldChanged: () => {}
}