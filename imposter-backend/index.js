const express = require('express')
var cors = require('cors')

const app = express()
const port = 3000
app.use(express.json());
app.use(cors())
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

let active = false;

let objects = [];

let players = [

]

app.get('/gameState', (req, res) => {
  res.json({ active, players,objects });
})

app.post('/gameState/reset', (req, res) => {
  players = [];
  active = false;
  objects = [];
  res.json({ active, players });
})

app.post('/kill/:playerId', (req, res) => {
  let idx = players.findIndex((player) => player.id == req.params.playerId);
  players[idx] = { ...players[idx], alive: false };
  res.json({ active, players });

})

app.post('/gameState/start', (req, res) => {
  objects = req.body.map((sw) => { return {...sw, active: false} })
  active = true;
  players[Math.floor(Math.random() * players.length)].imposter = true
  res.json({ active, players, objects });
})

app.post('/gameState/stop', (req, res) => {
  active = false;

  res.json({ active, players });
})

app.post('/players', (req, res) => {
  let max = players.reduce((curr, player) => player.id > curr ? player.id : curr, 0);
  let player = { ...req.body, id: max + 1, alive: true }
  players.push(player);
  res.json(player);
});

app.patch('/players/:playerId', (req, res) => {
  let idx = players.findIndex((player) => player.id == req.params.playerId);
  players[idx] = { ...players[idx], ...req.body };
  res.json(players[idx]);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})