const dns = require('dns');
const fs = require('fs');
require("dotenv").config();

dns.resolveSrv('_mongodb._tcp.cluster0.j0lqxpi.mongodb.net', (err, addresses) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  
  const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
  
  // Extract user and password from original mongo url
  // mongodb+srv://thiru:thiru123@cluster0.j0lqxpi.mongodb.net/password-reset?retryWrites=true&w=majority
  const match = process.env.MONGO_URL.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);
  
  if (match) {
    const user = match[1];
    const pass = match[2];
    const newUri = `mongodb://${user}:${pass}@${hosts}/password-reset?ssl=true&replicaSet=atlas-13c58w-shard-0&authSource=admin&retryWrites=true&w=majority`;
    fs.writeFileSync('uri.txt', newUri);
    console.log("URI written to uri.txt");
  } else {
    console.error("Could not parse original URL");
  }
});
