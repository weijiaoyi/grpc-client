const syntaxHighlight = (json) => {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  return json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export { syntaxHighlight }