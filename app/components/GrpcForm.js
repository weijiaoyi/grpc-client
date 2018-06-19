import React, {Component} from 'react';
import Form from "react-jsonschema-form";
import style from "../styles/style.scss";

const mapFormTypeToProtobufType = (type) => {
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

  const { fields } = props;
  let properties = {};
  Object.keys(fields).map((key, index) => {
    let { fieldName, type, required, repeated, defaultValue } = fields[key];
    properties[fieldName] = {
      type: mapFormTypeToProtobufType(type),
      title: fieldName
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

  const uiSchema = {
    'form': {
      className: style['form-fieldset']
    }
  }

  const log = (value) => console.log(value);

  return (
    <div>
      { props.fields.length > 0 &&
      <Form 
        schema={schema}
        uiSchema={uiSchema}
        // onChange={log("changed")}
        onSubmit={props.onFormSubmit} 
      >
        <button type="submit" className={style.button}>Submit</button>
      </Form>
      }
    </div>
  )
}