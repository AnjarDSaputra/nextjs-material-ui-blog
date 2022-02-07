import express from 'express';
import cors  from 'cors';

let app = express()
 
app.use(cors())

let whitelist = ['http://localhost', 'https://sarikurma.id', 'https://toko.sarikurma.id']

// let corsOptionsDelegate = function (req, callback) {
//   let corsOptions;
//   if (whitelist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }
 
// app.get('/products/:id', cors(corsOptionsDelegate), function (req, res, next) {
//   res.json({msg: 'This is CORS-enabled for a whitelisted domain.'})
// })
 

app.get('/', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for a whitelisted domain.'})
})

// app.listen(80, function () {
//   console.log('CORS-enabled web server listening on port 80')
// })