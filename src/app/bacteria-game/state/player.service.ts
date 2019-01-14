import {Injectable, NgZone} from '@angular/core';
import {ID, push, transaction} from '@datorama/akita';
import {GameStateQuery} from './game-state.query';
import {GameState} from './game-state.store';
import {Bacteria, createPlayerWithBacterias, Player} from './player.model';
import {PlayerQuery} from './player.query';
import {PlayerStore} from './player.store';

@Injectable({providedIn: 'root'})
export class PlayerService {

  constructor(private playerStore: PlayerStore, private gameStateQuery: GameStateQuery, private playerQuery: PlayerQuery,
              private ngZone: NgZone) {
  }

  @transaction()
  init(playersData: { x: number, y: number, color: [number, number, number] }[], radius: number = 50) {
    this.playerStore.remove();
    playersData.forEach((playerData, index) =>
      this.add(createPlayerWithBacterias(index, playerData.x, playerData.y, playerData.color, radius))
    );
    this.setActive(0);
  }

  setActive(playerId: ID) {
    this.playerStore.setActive(playerId);
  }

  add(player: Player) {
    this.playerStore.add(player);
  }

  update(id, player: Partial<Player>) {
    this.playerStore.update(id, player);
  }

  remove(id: ID) {
    this.playerStore.remove(id);
  }

  updatePlayerPos(x: number, y: number) {
    if (this.gameStateQuery.getSnapshot().currentState === GameState.RUNNING) {
      this.playerStore.updateAll({x, y});
    }
  }

  addBacterias(id: ID, bacs: Bacteria[]) {
    this.playerStore.update(id, state => ({bacterias: state.bacterias.concat(bacs)}));
  }

  @transaction()
  gameLoop(imageData: Uint8ClampedArray, width: number, height: number, deltaTime: number) {
    this.ngZone.runOutsideAngular(() => {

      const players = this.playerQuery.getAll();
      const colorToPlayer: { [key: string]: Player } = {};
      players.forEach(player => colorToPlayer[player.color.toString()] = player);

      players.forEach(player => {
        const bacs = [].concat(player.bacterias);
        const mx = player.x;
        const my = player.y;
        const bacToAddToWinner: { [key: number]: Bacteria[] } = {};

        for (let i = bacs.length - 1; i > -1; i--) {
          const {x, y} = bacs[i];
          const winningPlayer = this.eat(x, y, width, height, player.id, colorToPlayer, imageData);
          if (winningPlayer != null) {
            const index = (x + (y * width)) * 4;
                 imageData[index] = winningPlayer.color[0];
                 imageData[index + 1] = winningPlayer.color[1];
                 imageData[index + 2] = winningPlayer.color[2];
            bacs.splice(i, 1);
            const winnerId = winningPlayer.id;
            if (bacToAddToWinner[winnerId] == null) {
              bacToAddToWinner[winnerId] = [];
            }
            bacToAddToWinner[winnerId].push({x, y});
            continue;
          }


          const moveDirectionX = mx - x;
          const moveDirectionY = my - y;

          // normalize
          const len = Math.sqrt(moveDirectionX * moveDirectionX + moveDirectionY * moveDirectionY);
          const xStep = Math.round((moveDirectionX / len) * deltaTime * player.maxSpeed);
          const yStep = Math.round((moveDirectionY / len) * deltaTime * player.maxSpeed);

          let wasFree = this.moveToIfFree(xStep, yStep, x, y, imageData, width, height, bacs, i);
          if (wasFree) {
            continue;
          }
          for (let dX = xStep; dX !== 0; dX = dX - Math.sign(xStep)) {
            wasFree = this.moveToIfFree(
              dX,
              yStep, x, y, imageData, width, height, bacs, i);
            if (wasFree) {
              break;
            }
          }
          if (wasFree) {
            continue;
          }
          for (let dY = yStep; dY !== 0; dY = dY - Math.sign(yStep)) {
            wasFree = this.moveToIfFree(
              xStep,
              dY, x, y, imageData, width, height, bacs, i);
            if (wasFree) {
              break;
            }
          }
          if (wasFree) {
            continue;
          }
          const randomX = Math.round((Math.random() - 0.5) * deltaTime * player.maxSpeed);
          const randomY = Math.round((Math.random() - 0.5) * deltaTime * player.maxSpeed);
          this.moveToIfFree(randomX, randomY, x, y, imageData, width, height, bacs, i);
        }

        Object.entries(bacToAddToWinner).forEach(entry => {
          return this.addBacterias(entry[0], entry[1]);
        });
        this.update(player.id, {bacterias: bacs});
      });
    });
  }

  moveToIfFree(xStep: number, yStep: number, x: number, y: number,
               imageData: Uint8ClampedArray, width: number, height: number, bacs: Bacteria[],
               bacIndex: number): boolean {
    const moveToX = Math.max(Math.min(width - 1, x + xStep), 0);
    const moveToY = Math.max(Math.min(height - 1, y + yStep), 0);
    const testIndex = (moveToX + (moveToY * width)) * 4;
    const currentGridColor = imageData[testIndex] + imageData[testIndex + 1] + imageData[testIndex + 2];
    if (currentGridColor > 0) {
      return false;
    }
    const index = (x + (y * width)) * 4;
    imageData[testIndex] = imageData[index];
    imageData [testIndex + 1] = imageData[index + 1];
    imageData [testIndex + 3] = imageData[index + 3];

    imageData[index] = 0;
    imageData[index + 1] = 0;
    imageData[index + 2] = 0;
    bacs[bacIndex] = {x: moveToX, y: moveToY};
    return true;
  }

  private eat(x: number, y: number, width: number, height: number, playerId: ID, colorToPlayer: { [p: string]: Player },
              imageData: Uint8ClampedArray): Player {
    // check if 3 of N E S W are opponent colors
    const result: Player[] = [];
    if (y > 1) {
      // check N;
      const otherPlayer = this.playerOnCell(x, y - 1, imageData, colorToPlayer, width);
      if (otherPlayer != null && otherPlayer.id !== playerId) {
        result.push(otherPlayer);
      }
    }
    if (x < width - 2) {
      // check E;
      const otherPlayer = this.playerOnCell(x + 1, y, imageData, colorToPlayer, width);
      if (otherPlayer != null && otherPlayer.id !== playerId) {
        result.push(otherPlayer);
      }
    }
    if (result.length < 1) {
      return null;
    }
    if (y < height - 2) {
      // check S;
      const otherPlayer = this.playerOnCell(x, y + 1, imageData, colorToPlayer, width);
      if (otherPlayer != null && otherPlayer.id !== playerId) {
        result.push(otherPlayer);
      }
    }
    if (result.length < 2) {
      return null;
    }
    if (x > 1) {
      // check W;
      const otherPlayer = this.playerOnCell(x - 1, y, imageData, colorToPlayer, width);
      if (otherPlayer != null && otherPlayer.id !== playerId) {
        result.push(otherPlayer);
      }
    }
    if (result.length < 3) {
      return null;
    }

    return (result[0]);
  }

  private playerOnCell(x: number, y: number, imageData: Uint8ClampedArray, colorToPlayer: { [p: string]: Player }, width: number) {
    const testIndex = (x + (y * width)) * 4;
    const currentGridColor = [imageData[testIndex], imageData[testIndex + 1], imageData[testIndex + 2]].toString();
    const otherPlayer = colorToPlayer[currentGridColor];
    return otherPlayer;
  }
}
