import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { GameComponent } from './game/game.component';
import { CreateplayerComponent } from './createplayer/createplayer.component';
import { GameManagementComponent } from './game-management/game-management.component';
import { GameTileComponent } from './game/game-tile/game-tile.component';
import { GameTileCharacterComponent } from './game/game-tile-character/game-tile-character.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    CreateplayerComponent,
    GameManagementComponent,
    GameTileComponent,
    GameTileCharacterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([{
      path: "play",
      component: GameComponent
    },
    {
      path: "**",
      redirectTo: "play"
    }], {useHash: true})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
