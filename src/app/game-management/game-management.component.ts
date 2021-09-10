import { Component, OnInit } from '@angular/core';
import { NetworkService } from '../network.service';

@Component({
  selector: 'app-game-management',
  templateUrl: './game-management.component.html',
  styleUrls: ['./game-management.component.css']
})
export class GameManagementComponent implements OnInit {
  
  constructor(private networkService : NetworkService) { }

  ngOnInit(): void {
  }

  
  reset() {
    this.networkService.reset();
  }

  start() {
    this.networkService.startGame();
  }

  stop() {
    this.networkService.stopGame();
  }

  generate() {
    let seed = prompt("Provide seed:");
    if (seed) {
      this.networkService.generateDungeon(seed);
    }
  }

  get started() {
    return this.networkService.gameState?.active;
  }

}
