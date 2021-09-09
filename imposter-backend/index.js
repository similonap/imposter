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

let players = [
    
]

app.get('/players', (req, res) => {
  res.json(players);
})

app.post('/clear', (req, res) => {
    players = [];
    res.json(players);
  })

app.post('/players', (req, res) => {
    let max = players.reduce((curr, player) => player.id > curr ? player.id : curr,0);
    let player = {...req.body, id: max+1}
    players.push(player);
    res.json(player);
});

app.patch('/players/:playerId', (req,res) => {
    let idx = players.findIndex((player) => player.id == req.params.playerId);
    players[idx] = {...players[idx], ...req.body};
    res.json(players[idx]);
})

app.post

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})