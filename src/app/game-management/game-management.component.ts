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

}
