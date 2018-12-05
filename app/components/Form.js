import React from 'react';
import { reset, Field, reduxForm } from 'redux-form';
import style from "../styles/style.scss";

const input = ({ required, input, label, type, placeholder, meta: { touched, error, warning, validate } }) => {
  return (
    <tr>
      <td><label>{label}</label></td>
      <td><input {...input} type={type} placeholder={placeholder}/></td>
    </tr>
  )
}

const GenerateFields = (fields) => {
  return Object.keys(fields).map((field, index) => {
    let { key, fieldName, type, required, defaultValue } = fields[field];
    return (
    <Field 
      key={key}
      // parse={mapProtobufTypeToFieldType(type) === 'number' && ((val) => isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
      component={input}
      label={fieldName}
      name={key}
      required={!!required}
      type={type}
    />
    )
  });
}

const Form = (props) => {
  const { onFormSubmit, handleSubmit, pristine, reset, submitting, fields, submitScheme } = props;

  return (
    <div>
    { fields.length > 0
      ?
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <table className={style.mat2}>
          <tbody>
            {GenerateFields(fields)}
          </tbody>
        </table>
        <div>
        {
          !!submitScheme
          ?
            {...submitScheme}
          :
          <div className={style['buttons']}>
            <button role="button" className={style.button} type="submit" disabled={pristine || submitting}>Submit</button>
            <button type="button" className={style.button} disabled={pristine || submitting} onClick={reset}>Clear Values</button>
          </div>
        }
        </div>
      </form>
      :
      <p></p>
    }
    </div>
  )
}

export default reduxForm({
  form: 'form'
})(Form)