const http = require('http');

// Example start line
// node meta-server.js 3021 --dev

const hostname = '127.0.0.1';
let port = 3001;

const DEVELOPMENT_API_URL="https://api.rehomeofficial.com/api"
const PRODUCTION_API_URL="https://api.rehomeofficial.com/api"

let BASEURL = DEVELOPMENT_API_URL;

if(process.argv[2]){
    port = Number(process.argv[2]);
}

if (process.argv.indexOf('--prod') > -1) {
    BASEURL = PRODUCTION_API_URL;
}

if (process.argv.indexOf('--dev') > -1) {
    BASEURL = DEVELOPMENT_API_URL;
}

const server = http.createServer( async (req, res) => {
  if (req.url.startsWith('/listings/')) {
    const id = req.url.split('/')[2]; // Extract the id from the URL
    try {
        const response = await fetch(`${BASEURL}/rehome-properties/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
  
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Error occurred while fetching data');
      }
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('404 Not Found\n');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
