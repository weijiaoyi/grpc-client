import React, {Component} from 'react';
import Form from "react-jsonschema-form";
import style from "../styles/style.scss";

const CustomFieldTemplate = (props) => {
  const {id, type, classNames, label, help, required, description, errors, children} = props;
  return (
    <div className={classNames}>
      <label htmlFor={id}>{label}{required ? "*" : null}</label>
      <input type={type} required={!!required}/>
    </div>
  );
}

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

const mapProtobufTypeToFormType = (type) => {
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
    return 'boolean';

    default:
    return 'string';
  }
}

export default (props) => {

  const { fields, onFormSubmit } = props;
  let properties = {};
  Object.keys(fields).map((key, index) => {
    let { fieldName, type, required, repeated, defaultValue } = fields[key];
    properties[fieldName] = {
      type: mapProtobufTypeToFormType(type),
      title: fieldName,
      required: required,
      fieldType: mapProtobufTypeToFieldType(type)
    }
  });

  let required = fields.filter((field) => {
    if(field.required) return true;
  }).map((field) => field.fieldName);

  const schema = {
    type: "object",
    required: required,
    properties: properties
  };

  const log = (value) => console.log(value);

  return (
    <div>
      { fields.length > 0 
      ?
      <Form 
        schema={schema}
        FieldTemplate={CustomFieldTemplate}
        // onChange={log("changed")}
        onSubmit={onFormSubmit} 
      >
        <button type="submit" className={style.button}>Send Request</button>
      </Form>
      :
      <p>Choose a service that available from proto file to view its field.</p>
      }
    </div>
  )
}