const dash = require('dashdash');
const fetch = require('node-fetch');

const options = {
    allowUnknown: true,
    options: [{
      names: ['output', 'o'],
      type: 'string',
      help: 'file in which to store the fetched content'
    }],
  };

const parser = dash.createParser(options);

const opts = parser.parse(options);
const output = opts.output;
const url = opts._args[0];
// console.log(output, url);

fetch("https://artii.herokuapp.com/make?text=curl++this")
  .then(res => res.text())
  .then(text => console.log(text))
  .catch(err => console.log(err));
