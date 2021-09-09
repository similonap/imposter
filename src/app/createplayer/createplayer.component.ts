import { Component, OnInit } from '@angular/core';
import { NetworkService, Player } from '../network.service';

@Component({
  selector: 'app-createplayer',
  templateUrl: './createplayer.component.html',
  styleUrls: ['./createplayer.component.css']
})
export class CreateplayerComponent implements OnInit {

  name: string = "";

  _color: string = ""

  constructor(private networkService : NetworkService) { }

  ngOnInit(): void {
  }

  colorChanged(color: string) {
    this.color = color;
  }

  get color() {
    return this._color ? this._color : this.colors[0];
  }

  set color(color: string) {
    this._color = color;
  }

  get colors() {
    let colors: string[] = [
      "black","blue","brown","green"
    ];

    let inUse = this.networkService.players.map((player: Player) => player.color);

    let difference = colors.filter(x => !inUse.includes(x));

    return difference;
  }

  hasPlayer() {
    return !!this.networkService.me;
  }

  createPlayer() {
    this.networkService.createMe({
      name: this.name,
      color: this.color,
      position: {
        x: 39,
        y: 19
      }
    });

  }

}
