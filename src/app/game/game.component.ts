import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { createDungeon, GameTile } from '../dungeonGenerator';
import * as _ from 'lodash';
import { NetworkService, Player, Position } from '../network.service';




@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {


  @Input("gameWidth") gameWidth: number = 0;
  @Input("gameHeight") gameHeight: number = 0;
  
  @ViewChild('gameContainer') gameContainer: ElementRef<HTMLInputElement> | undefined;

  get gameTiles() : GameTile[][] {
    return this.networkService.gameTiles;
  }


  get XViewingRange(): number[] {
    if (this.networkService.me) 
      return _.range(this.networkService.me.position.x - 10, this.networkService.me.position.x + 10);
    else 
      return _.range(0,20);
  }

  get YViewingRange(): number[] {
    if (this.networkService.me)
      return _.range(this.networkService.me.position.y - 10, this.networkService.me.position.y + 10);
    else 
      return _.range(0,20);
  }


  get blockSize() {
    return this.gameHeight / 20
  }

  constructor(private networkService: NetworkService) {


  }

  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.networkService.me) {
      let newPosition: Position = this.networkService.me.position;
      if (event.key === 'ArrowLeft') {
        newPosition = {
          ...this.networkService.me.position,
          x: this.networkService.me.position.x - 1
        }
      }
      if (event.key === 'ArrowRight') {
        newPosition = {
          ...this.networkService.me.position,
          x: this.networkService.me.position.x + 1
        }
      }
      if (event.key === 'ArrowDown') {
        newPosition = {
          ...this.networkService.me.position,
          y: this.networkService.me.position.y + 1
        }
      }
      if (event.key === 'ArrowUp') {
        newPosition = {
          ...this.networkService.me.position,
          y: this.networkService.me.position.y - 1
        }
      }
      if (event.key === ' ') {
        if (this.networkService.me.imposter) {
          let playerAtMyLocation = this.networkService.getPlayerAtMyLocation();
           console.log(this.networkService.players);
           if (playerAtMyLocation) {
            this.networkService.killPlayer(playerAtMyLocation.id!);
           }
        }
      }
      if (this.gameTiles[newPosition.y][newPosition.x].type === 'floor' || this.gameTiles[newPosition.y][newPosition.x].type === 'door') {
        this.networkService.setNewMePosition(newPosition);
      }
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

  get me() {
    return this.networkService.me;
  }
  


  ngOnInit(): void {


  }



}
