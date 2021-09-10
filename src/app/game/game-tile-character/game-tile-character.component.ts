import { Component, Input, OnInit } from '@angular/core';
import { NetworkService, Player } from 'src/app/network.service';

@Component({
  selector: 'app-game-tile-character',
  templateUrl: './game-tile-character.component.html',
  styleUrls: ['./game-tile-character.component.css']
})
export class GameTileCharacterComponent implements OnInit {

  @Input("xCoord") x: number = 0;
  @Input("yCoord") y: number = 0;

  constructor(private networkService: NetworkService) {


  }

  get Image() {
    let player = this.networkService.getPlayerAtPosition(this.x,this.y);
    if (player?.alive) {
      return 'assets/characters/' + player!.color + '.png'
    } else {
      return 'assets/characters/' + player!.color + '_dead.png'
    }
  }

  getPlayerAtPosition(x: number, y: number): Player | undefined {
    return this.networkService.getPlayerAtPosition(x,y);
  }

  ngOnInit(): void {
  }

}
