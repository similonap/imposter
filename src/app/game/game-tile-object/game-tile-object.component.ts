import { Component, Input, OnInit } from '@angular/core';
import { NetworkService } from 'src/app/network.service';

@Component({
  selector: 'app-game-tile-object',
  templateUrl: './game-tile-object.component.html',
  styleUrls: ['./game-tile-object.component.css']
})
export class GameTileObjectComponent implements OnInit {

  @Input("xCoord") x: number = 0;
  @Input("yCoord") y: number = 0;

  constructor(private networkService: NetworkService) { }

  ngOnInit(): void {
  }

  get Image() {
    let object = this.networkService.getObjectAtPosition(this.x, this.y);
    return 'assets/items/computer.jpg';
  }

  getObjectAtPosition(x: number, y: number): Object | undefined {
    return this.networkService.getObjectAtPosition(x, y);
  }
}
