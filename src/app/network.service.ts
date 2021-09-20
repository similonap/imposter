import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createDungeon, createObjects, Dungeon, Object } from './dungeonGenerator';
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
  randomSeed: string = 'initialSeed';
  dungeon?: Dungeon = undefined;
  objects: Object[] = [];

  get gameTiles() {
    return this.dungeon?.grid!;
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

  getObjectAtPosition(x: number, y: number): Object | undefined {
    return this.objects.find((object: Object) => object.position.x == x && object.position.y == y);
  }

  killPlayer(id: number) {
    this.http.post<GameState>("http://localhost:3000/kill/" + id, {}).toPromise().then((result: GameState) => {
      this.gameState = result;
    })
  }

  getPlayerAtMyLocation(): Player | undefined {
    let player = this.players.find((player: Player) => player.position.x == this.me!.position.x && player.position.y == this.me!.position.y && player.id != this.me!.id);
    return player;
  }

  setNewMePosition(position: Position) {
    this.http.patch("http://localhost:3000/players/" + this.playerId, {position: position}).toPromise().then((result: any) => {
    })
  }

  getRandomPositionInFirstRoom() : Position {
    let x = _.random(this.dungeon!.rooms[0].x+1, this.dungeon!.rooms[0].x + this.dungeon!.rooms[0].width-1);
    let y = _.random(this.dungeon!.rooms[0].y+1, this.dungeon!.rooms[0].y + this.dungeon!.rooms[0].height-1);
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
    this.http.post<GameState>("http://localhost:3000/gameState/start",[]).toPromise().then((result: GameState) => {
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
    this.objects = createObjects(this.dungeon, seed);
  }

  constructor(private http: HttpClient) { 

    this.generateDungeon(this.randomSeed);

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