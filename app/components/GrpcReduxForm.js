import React from 'react';
import { reset, Field, reduxForm } from 'redux-form';
import style from "../styles/style.scss";

const mapProtobufTypeToFieldType = (type) => {
  switch(type){

    case 'double':
    case 'float':
    case 'int32':
    case 'int64':
    case 'uint32':
    case 'uint64':
    case 'sint32':
    case 'sint64':
    case 'fixed32':
    case 'fixed64':
    case 'sfixed32':
    case 'sfixed64':
    return 'number';

    case 'bool':
    return 'checkbox';

    default:
    return 'text';
  }
}

const input = ({ required, input, label, type, placeholder, meta: { touched, error, warning, validate } }) => {
  return (
    <tr>
      <td><label>{label}</label></td>
      <td><input {...input} type={type} placeholder={placeholder}/></td>
    </tr>
  )
}

const GenerateFields = (fields) => {
  return Object.keys(fields).map((key, index) => {
    let { fieldName, type, required, repeated, defaultValue } = fields[key];
    return (
    <Field 
      key={fieldName}
      parse={mapProtobufTypeToFieldType(type) === 'number' && ((val) => isNaN(parseInt(val, 10)) ? null : parseInt(val, 10))}
      component={input}
      label={fieldName}
      name={fieldName}
      required={!!required}
      type={mapProtobufTypeToFieldType(type)}
    />
    )
  });
}

const GrpcForm = (props) => {
  const { onFormSubmit, handleSubmit, pristine, reset, submitting, fields } = props;
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
        <div className={style['buttons']}>
          <button role="button" className={style.button} type="submit" disabled={pristine || submitting}>Submit</button>
          <button type="button" className={style.button} disabled={pristine || submitting} onClick={reset}>Clear Values</button>
        </div>
      </form>
      :
      <p>Choose a service that available from proto file to view its field.</p>
    }
    </div>
  )
}

export default reduxForm({
  form: 'grpcForm'
})(GrpcForm)