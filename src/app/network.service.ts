import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Position {
  x: number,
  y: number
}

export interface Player {
  id?: number,
  name: string,
  color: string,
  position: Position
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {



  me: Player | undefined = undefined;

  players : Player[] = [
    
  ];

  getPlayerAtPosition(x: number, y: number): Player | undefined {
    return this.players.find((player: Player) => player.position.x == x && player.position.y == y);
  }

  setNewMePosition(position: Position) {
    if (this.me) {
      this.http.patch("http://localhost:3000/players/" + this.me.id, {position: position}).toPromise().then((result: any) => {
         this.me!.position = result.position;
      })
    }
  }

  createMe(player: Player) {
    this.http.post<Player>("http://localhost:3000/players", player).toPromise().then((result: Player) => {
      this.me = result;
    })
  }

  reset() {
    this.http.post<Player[]>("http://localhost:3000/clear",{}).toPromise().then((result: Player[]) => {
      this.me = undefined;
      this.players = result;
    })
  }

  constructor(private http: HttpClient) { 
    this.players = [];

    setInterval(() => {
      this.http.get<Player[]>("http://localhost:3000/players").toPromise().then((result: Player[]) => {
        this.players = [...this.me?[this.me]:[], ...result.filter((player : Player) => player.id != this.me?.id)];
      })
    }, 100);

  }
}
