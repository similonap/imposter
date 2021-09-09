import { Component, OnInit } from '@angular/core';
import { createDungeon } from '../dungeonGenerator';
import * as _ from 'lodash';

interface GameTile {
  type: any,
  opacity: number
}

interface Position {
  x: number,
  y: number
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  gameTiles : GameTile[][] = [];


  get XViewingRange(): number[] {
    return _.range(this.yourPosition.x-10, this.yourPosition.x+10);

  }

  get YViewingRange(): number[] {
    return _.range(this.yourPosition.y-10, this.yourPosition.y+10);

  }

  yourPosition: Position = {} as Position;

  constructor() { 

    let dungeon = createDungeon();
    this.gameTiles = dungeon.map;

    let x: number = dungeon.firstRoom.x,y : number = dungeon.firstRoom.y;

    this.yourPosition = {
      x,y
    }

  }

  handleKeyboardEvent(event: KeyboardEvent): void {
    let newPosition : Position = this.yourPosition;
    if (event.key === 'ArrowLeft') {
      newPosition = {
        ...this.yourPosition,
        x: this.yourPosition.x-1
      }
    }
    if (event.key === 'ArrowRight') {
      newPosition = {
        ...this.yourPosition,
        x: this.yourPosition.x+1
      }
    }
    if (event.key === 'ArrowDown') {
      newPosition = {
        ...this.yourPosition,
        y: this.yourPosition.y+1
      }
    }
    if (event.key === 'ArrowUp') {
      newPosition = {
        ...this.yourPosition,
        y: this.yourPosition.y-1
      }
    }
    if (this.gameTiles[newPosition.y][newPosition.x].type === 'floor' || this.gameTiles[newPosition.y][newPosition.x].type === 'door') {
      this.yourPosition = newPosition;
    }
  }

  getTile(x: number, y: number) {
    if (y >= this.gameTiles.length || x >= this.gameTiles[0].length) {
      return {
        type: 'nothing',
        opacity: 1.0
      }
    }
    if (x < 0 || y < 0) {
      return {
        type: 'nothing', opacity: 1.0
      }
    }

    return this.gameTiles[y][x];
  }

  ngOnInit(): void {
    

  }

}
