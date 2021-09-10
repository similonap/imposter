import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createDungeon, Dungeon } from './dungeonGenerator';
import * as _ from 'lodash';

export interface Position {
  x: number,
  y: number
}

export interface Player {
  id?: number,
  name: string,
  color: string,
  position: Position,
  imposter?: boolean,
  alive?: boolean
}

export interface GameState {
  players: Player[],
  active: boolean
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  dungeon?: Dungeon = undefined;

  get gameTiles() {
    return this.dungeon?.map!;
  }

  playerId: number = 0;

  gameState?: GameState = undefined;

  get players() {
    if (this.gameState) {
      return this.gameState.players;
    } else {
      return [];
    }
  }

  get me() {
    if (this.playerId > 0) {
      return this.gameState?.players.find((player: Player) => player.id == this.playerId)
    } else {
      return undefined;
    }
  }

  getPlayerAtPosition(x: number, y: number): Player | undefined {
    return this.players.find((player: Player) => player.position.x == x && player.position.y == y);
  }

  killPlayer(id: number) {
    this.http.post<GameState>("http://localhost:3000/kill/" + id, {}).toPromise().then((result: GameState) => {
      this.gameState = result;
    })
  }

  getPlayerAtMyLocation(): Player | undefined {
    let player = this.getPlayerAtPosition(this.me!.position.x, this.me!.position.y);
    if (player && player.id != this.me!.id) {
      return player;
    }
    return undefined;
  }

  setNewMePosition(position: Position) {
    this.http.patch("http://localhost:3000/players/" + this.playerId, {position: position}).toPromise().then((result: any) => {
    })
  }

  getRandomPositionInFirstRoom() : Position {
    let x = _.random(this.dungeon!.firstRoom.x, this.dungeon!.firstRoom.x + this.dungeon!.firstRoom.width);
    let y = _.random(this.dungeon!.firstRoom.y, this.dungeon!.firstRoom.y + this.dungeon!.firstRoom.height);
    return {
      x,y
    }
  }

  createMe(name: string, color: string) {
    let newPlayer : Player = {
      name,
      color,
      position: this.getRandomPositionInFirstRoom()
    }
    this.http.post<Player>("http://localhost:3000/players", newPlayer).toPromise().then((result: Player) => {
      this.playerId = result.id!;
    })
  }

  startGame() {
    this.http.post<GameState>("http://localhost:3000/gameState/start",this.dungeon!.switchPositions).toPromise().then((result: GameState) => {
      this.gameState = result;
    })    
  }

  stopGame() {
    this.http.post<GameState>("http://localhost:3000/gameState/stop",{}).toPromise().then((result: GameState) => {
      this.gameState = result;
    })    
  }

  reset() {
    this.http.post<GameState>("http://localhost:3000/gameState/reset",{}).toPromise().then((result: GameState) => {
      this.gameState = result;
      this.playerId = 0;
    })
  }

  generateDungeon(seed: string) {
    this.dungeon = createDungeon(seed);
  }

  constructor(private http: HttpClient) { 

    this.generateDungeon('initialSeed');

    console.log(this.dungeon?.switchPositions);
    
    setInterval(() => {
      this.http.get<GameState>("http://localhost:3000/gameState").toPromise().then((result: GameState) => {
        this.gameState = {...result};
        if (this.gameState.players.length == 0) {
          this.playerId = 0;
        }
      })
    }, 100);

  }
}
