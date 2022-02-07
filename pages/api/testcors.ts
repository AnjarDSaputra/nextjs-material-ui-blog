import NextCors from 'nextjs-cors';
import type { NextApiRequest, NextApiResponse } from 'next'

let whitelist = ['localhost:3000', 'sarikurma.id', 'toko.sarikurma.id']

async function handler(req: NextApiRequest, res: NextApiResponse) {
   // Run the cors middleware
   // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors

   console.log(req.headers.host);

   let founded = whitelist.find(function(value){
     return (value === req.headers.host);
   });
   
   console.log(founded);

   if(founded != null) {

   }

   await NextCors(req, res, {
      // Options
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      //  origin: ['sarikurma.id', 'toko.sarikurma.id','http://localhost','*'],
      origin: '*',
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
   });

   // Rest of the API logic
   res.json({ message: 'Hello NextJs Cors!' });
}