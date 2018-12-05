const jsonToUrlEncoded = (obj: Object): string => {
  if(typeof obj !== "object")
      if(typeof console !== "undefined"){
        console.log("\"obj\" is not a JSON object");
        return null;
      }
    let u = encodeURIComponent;
    let urljson = "";
    let keys = Object.keys(obj);
    for(var i=0; i <keys.length; i++){
        urljson += u(keys[i]) + "=" + u(obj[keys[i]]);
        if(i < (keys.length-1))urljson+="&";
    }
    return urljson;
}

export { jsonToUrlEncoded }