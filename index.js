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
    const itemId = 'ECF45E82-F829-572A-3313-F95B880ECCE3'
    const data = await getItemData(itemId);
    const item = store.sync(data);
    // if you don't do this, there's a circular reference, and that'll hit the buffers with JSON serialisation
    if (item.list && item.list.all_children) {
      delete item.list.all_children;
    }
    res.send(item);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

async function getItemData(itemId) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'rl.talis.local',
      path: `/3/life/draft_items/${itemId}?include=resource,importance,content,list,resource.part_of`,
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