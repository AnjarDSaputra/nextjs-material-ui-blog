let whitelist = ['localhost:3000', 'sarikurma.id', 'toko.sarikurma.id']

const allowCors = fn => async (req, res) => {

  // console.log(req.headers.host);

   let founded = whitelist.find(function(value){
     return (value === req.headers.host);
   });
   
   console.log('founded: '+founded);
   console.log('b: '+(founded == null))

   if(founded == null) {
    res.status(400).end()
    return
   }

  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.host);
  // console.log(req.headers.origin);
  // console.log(req.headers.host);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}

export default allowCors(handler)