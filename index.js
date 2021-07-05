const express = require('express')
const http = require('http');
const yayson = require('yayson')();

const app = express()
const port = 3000

const store = new yayson.Store()

const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImxvY2FsLWp3ayJ9.eyJqdGkiOiI3NWI0NGVhMWVlNDhlNGM2ZTgyOGZlYTIwZGU3MDY5MDY5NTdmOTQ1IiwiaWF0IjoxNjI1NDc3Mjk2LCJleHAiOjE2MjU0ODMyOTYsImF1ZCI6InByaW1hdGUiLCJzdWIiOiJwcmltYXRlIiwic2NvcGVzIjpbInN1IiwicHJpbWF0ZSJdfQ.GdIpMIy-6DoZTXpIMNfP15J9bXXGl3DRYC_G9oNrwjXfE8Tty0liqB-hfs1DSh2OpowisDl2KGOaHCa78bmQk1dNntCpN6WgDVsRdr7Gvtf6WrfxP5KbH1askR45m8iE3ADhyU1E9B9uRZ6cls-BQMCrJEUrLJY4VfS0Nop83zWTUDU2y96NahhJurqaQRlgOiA5pKFyfzTDZ0bLPBKdvHMqh7mCOFM-uI32X4MvVn3_uX3w6Ik7LWS5RkDKziqe9k_UVHCf6u4iCEwC0AaNTwQOko0AlZE4yjQSKbPc3V8m0ji93EhIop3WYhcmuHA2lY-2m984XfZyd1TefJ3hdg`;

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