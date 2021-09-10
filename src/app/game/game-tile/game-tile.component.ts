import { Component, Input, OnInit } from '@angular/core';
import { NetworkService, Player } from 'src/app/network.service';

@Component({
  selector: 'app-game-tile',
  templateUrl: './game-tile.component.html',
  styleUrls: ['./game-tile.component.css']
})
export class GameTileComponent implements OnInit {

  @Input("xCoord") x: number = 0;
  @Input("yCoord") y: number = 0;
  
  ngOnInit(): void {
  }

}
