const dash = require('dashdash');
const fetch = require('node-fetch');
const fs  = require('fs');
const Headers = fetch.Headers;

const fsPromises = fs.promises;
const options = {
    allowUnknown: true,
    options: [{
      names: ['output', 'o'],
      type: 'string',
      help: 'file in which to store the fetched content'
    }, {
      names: ['agent', 'A'],
      type: 'string',
      help: "sets the user agent header"
    }, {
      names: ['referer', 'e'],
      type: "string",
      help: "sets the referer header"
    }, {
      names: ['dumpHeader', 'dump-header'],
      type: "string",
      help: "http response status line"
    },
    {
      names: ['data', 'd'],
      type: "string",
      help: "Make body of HTTP the request"
    }, {
      names: ['override', 'X'],
      type: "string",
      help: "Overrides the method of the HTTP request"
    },
    {
      names: ['help', 'h'],
      type: "bool",
      help: "Prints out help info"
    }
  ],
};

const parser = dash.createParser(options);

const opts = parser.parse(options);
const output = opts.output;
const agent = opts.agent;
const referer = opts.referer;
const dumpHeader = opts.dumpHeader;
const data = opts.data;
const override = opts.override;
const url = opts._args[0];
const help = opts.help;

let myHeaders = new Headers();
let myInit = {method: 'POST'};

if(help !== undefined){
  console.log(parser.help());
}

if (override !== undefined) {
  myInit.method = override;
}

if(data !== undefined){
  myInit.body = data;
}

if (dumpHeader !== undefined && url !==undefined) {
  fetch(url, myInit)
    .then(res => {
      fsPromises.writeFile(dumpHeader, `HTTP/1.1 ${res.status} ${res.statusText} \n`, "utf8");
      let headerKeys = res.headers.keys();
      for (let key of headerKeys) {
        fsPromises.appendFile(dumpHeader, `${key}: ${res.headers.get(key)}\n`, "utf8");
      }
    })
    .catch(err => console.log(err));
}

if (agent !== undefined) {
  myHeaders.append("User-Agent", agent);
}

if (referer !== undefined) {
  myHeaders.append("Referer", referer);
}

if(output === undefined && url !==undefined){
  fetch(url, myInit)
    .then(res => res.text())
    .then(text => console.log(text))
    .catch(err => console.log(err));
}

if (output !== undefined && url !==undefined) {
  fetch(url, myInit)
    .then(res => res.text())
    .then(text => fsPromises.writeFile(output, text, 'utf8'))
    .catch(err => console.log(err));
}
