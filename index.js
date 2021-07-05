const express = require('express')
const http = require('http');
const yayson = require('yayson')();

const app = express()
const port = 3000

const store = new yayson.Store()

const token = process.env.PERSONA_TOKEN;

if (!token) {
  throw new Error('Please specify a valid PERSONA_TOKEN')
}

app.get('/', async (req, res) => {
  try {
    const data = await getItemData();
    console.debug(data);
    const deserialised = store.sync(data);
    console.debug(deserialised);
    res.send(deserialised);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

async function getItemData() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'rl.talis.local',
      path: '/3/life/draft_items/ECF45E82-F829-572A-3313-F95B880ECCE3?include=resource,importance,content,list,resource.part_of',
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    const req = http.get(options, (res) => {
      let body = [];
      res.on('data', (chunk) => {
        body.push(chunk);
      });

      res.on('end', () => {
        try {
          let parsedBody = JSON.parse(Buffer.concat(body).toString());
          resolve(parsedBody);
        } catch(e) {
          reject(e);
        }
      });
    }).on('error', (error) => {
      reject(error)
    });
    req.end();
  });
}