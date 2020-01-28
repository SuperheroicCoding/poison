import {Injectable} from '@angular/core';
import {ID, transaction} from '@datorama/akita';
import {GameStateQuery} from './game-state.query';
import {GameState} from './game-state.store';
import {
  Bacteria,
  bacteriumEnergyRestoreTimeInSec,
  bacteriumMaxEnergy,
  createPlayerWithBacterias,
  Player,
  PlayerColorArray
} from './player.model';
import {PlayerQuery} from './player.query';
import {PlayerStore} from './player.store';

const energyLossPerOtherBacterium = 0.8;

@Injectable({providedIn: 'root'})
export class PlayerService {

  constructor(private playerStore: PlayerStore, private gameStateQuery: GameStateQuery, private playerQuery: PlayerQuery) {

    this.gameStateQuery.selectKeysPressed()
      .subscribe(value => this.updatePlayerPos(value.keysPressed, value.deltaTimeSec));
  }

  @transaction()
  init(playersData: { x: number, y: number, color: PlayerColorArray }[], radius: number = 30) {
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

  @transaction()
  private updatePlayerPos(keysPressed: string[], deltaTimeInSec: number) {

    let xDir0 = 0;
    let yDir0 = 0;
    let xDir1 = 0;
    let yDir1 = 0;

    keysPressed.forEach(key => {
        switch (key.toLowerCase()) {
          case('arrowup'):
            yDir1 = yDir1 - 1;
            break;
          case('arrowdown'):
            yDir1 = yDir1 + 1;
            break;
          case('arrowright'):
            xDir1 = xDir1 + 1;
            break;
          case('arrowleft'):
            xDir1 = xDir1 - 1;
            break;
          case('w'):
            yDir0 = yDir0 - 1;
            break;
          case('s'):
            yDir0 = yDir0 + 1;
            break;
          case('d'):
            xDir0 = xDir0 + 1;
            break;
          case('a'):
            xDir0 = xDir0 - 1;
            break;
        }
      }
    );
    const gameState = this.gameStateQuery.getValue();
    if (gameState.currentState === GameState.RUNNING) {
      this.playerStore.update(0, state => ({
        x: Math.max(Math.min(state.x + xDir0 * (state.maxSpeed * deltaTimeInSec), gameState.width), 0),
        y: Math.max(Math.min(state.y + yDir0 * (state.maxSpeed * deltaTimeInSec), gameState.height), 0)
      }));
      this.playerStore.update(1, state => ({
        x: Math.max(Math.min(state.x + xDir1 * (state.maxSpeed * deltaTimeInSec), gameState.width), 0),
        y: Math.max(Math.min(state.y + yDir1 * (state.maxSpeed * deltaTimeInSec), gameState.height), 0)
      }));
    }
  }

  addBacterias(id: ID, bacs: Bacteria[]) {
    this.playerStore.update(id, state => ({bacterias: state.bacterias.concat(bacs)}));
  }

  gameLoop(imageData: Uint8ClampedArray, width: number, height: number, deltaTimeSec: number) {
    this.handleBacEating(width, height, imageData, deltaTimeSec);

    const players = this.playerQuery.getAll().sort(a => Math.random() - 0.5);

    for (const player of players) {
      const bacs = [].concat(player.bacterias);
      const mx = player.x;
      const my = player.y;
      if (isNaN(mx) && isNaN(my)) {
        continue;
      }
      for (let i = bacs.length - 1; i > -1; i--) {
        const {x, y} = bacs[i];

        const moveDirectionX = mx - x;
        const moveDirectionY = my - y;

        // normalize
        const len = Math.sqrt(moveDirectionX * moveDirectionX + moveDirectionY * moveDirectionY);
        if (len === 0) {
          const randX = Math.round((Math.random() - 0.5) * deltaTimeSec * player.maxSpeed);
          const randY = Math.round((Math.random() - 0.5) * deltaTimeSec * player.maxSpeed);
          this.moveToIfFree(randX, randY, x, y, imageData, width, height, bacs, i, deltaTimeSec);
          continue;
        }

        const xStep = Math.round((moveDirectionX / len) * deltaTimeSec * player.maxSpeed);
        const yStep = Math.round((moveDirectionY / len) * deltaTimeSec * player.maxSpeed);

        let wasFree = this.moveToIfFree(xStep, yStep, x, y, imageData, width, height, bacs, i, deltaTimeSec);
        if (wasFree) {
          continue;
        }
        for (let dX = xStep; dX !== 0; dX = dX - Math.sign(xStep)) {
          wasFree = this.moveToIfFree(
            dX,
            yStep, x, y, imageData, width, height, bacs, i, deltaTimeSec);
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
            dY, x, y, imageData, width, height, bacs, i, deltaTimeSec);
          if (wasFree) {
            break;
          }
        }
        if (wasFree) {
          continue;
        }
        const randomX = Math.round((Math.random() - 0.5) * deltaTimeSec * player.maxSpeed);
        const randomY = Math.round((Math.random() - 0.5) * deltaTimeSec * player.maxSpeed);
        this.moveToIfFree(randomX, randomY, x, y, imageData, width, height, bacs, i, deltaTimeSec);
      }

      this.update(player.id, {bacterias: bacs});
    }
  }

  @transaction()
  private handleBacEating(width: number, height: number, imageData: Uint8ClampedArray, deltaTimeSec: number) {

    const players = this.getPLayerInRandomOrderToEqualifyChances();
    const colorToPlayer = this.getColorMapOfPlayers(players);

    for (const player of players) {
      const bacs = [...player.bacterias];
      const bacToAddToWinner: { [key: number]: Bacteria[] } = {};

      for (let i = bacs.length - 1; i > -1; i--) {
        let bacterium = bacs[i];
        const {x, y} = bacterium;
        const surroundingPlayers = this.findSurroundingPlayer(x, y, width, height, colorToPlayer, imageData);
        if (surroundingPlayers == null) {
          continue;
        }

        let otherPlayers = 0;
        let otherEnergy = 0;
        let ownPlayers = 0;
        let ownEnergy = 0;
        let maxAmount = 0;
        let winner: Player = null;
        for (const pId of Object.keys(surroundingPlayers)) {
          const surroundingPlayer = surroundingPlayers[pId];
          const sPlayer = surroundingPlayer.player;
          if (sPlayer.id === player.id) {
            ownPlayers += surroundingPlayer.amount;
            ownEnergy += surroundingPlayer.energy;
            continue;
          }
          if (maxAmount < surroundingPlayer.amount) {
            maxAmount = surroundingPlayer.amount;
            otherEnergy += surroundingPlayer.energy;
            winner = sPlayer;
          }
          otherPlayers += surroundingPlayer.amount;
        }
        if (otherEnergy > ownEnergy) {
          // if (otherPlayers > ownPlayers) {

          // let energyLoss = otherPlayers * energyLossPerOtherBacterium;
          let energyLoss = otherEnergy - ownEnergy;
          if (ownPlayers > 0) {
            energyLoss = energyLoss / ownPlayers;
          }

          bacs[i] = {...bacterium, energy: bacterium.energy - deltaTimeSec * energyLoss};
          if (bacterium.energy <= 0) {
            bacterium = bacs.splice(i, 1)[0];
            if (bacToAddToWinner[winner.id] == null) {
              bacToAddToWinner[winner.id] = [];
            }
            bacterium.energy = bacteriumMaxEnergy * .75; //  1.;
            bacToAddToWinner[winner.id].push(bacterium);
            const index = (x + (y * width)) * 4;
            imageData[index] = winner.color[0];
            imageData[index + 1] = winner.color[1];
            imageData[index + 2] = winner.color[2];
            imageData[index + 3] = winner.color[3];
          }
        } else {
          // gainEnergy
          bacs[i] = {...bacterium, energy: Math.min(bacteriumMaxEnergy, bacterium.energy + deltaTimeSec / bacteriumEnergyRestoreTimeInSec)};
        }
      }
      for (const entry of Object.entries(bacToAddToWinner)) {
        this.addBacterias(entry[0], entry[1]);
      }
      this.update(player.id, {bacterias: bacs});
    }
  }

  private getColorMapOfPlayers(players: Player[]) {
    const colorToPlayer: { [key: string]: Player } = {};
    for (const player of players) {
      const rgb = player.color.slice(0, 3);
      colorToPlayer[rgb.toString()] = player;
    }
    return colorToPlayer;
  }

  private getPLayerInRandomOrderToEqualifyChances() {
    return this.playerQuery.getAll().sort(a => Math.random() - 0.5);
  }

  moveToIfFree(xStep: number, yStep: number, x: number, y: number,
               imageData: Uint8ClampedArray, width: number, height: number, bacs: Bacteria[],
               bacIndex: number,
               deltaTimeSec: number): boolean {
    const moveToX = Math.max(Math.min(width - 1, x + xStep), 0);
    const moveToY = Math.max(Math.min(height - 1, y + yStep), 0);
    const testIndex = (moveToX + (moveToY * width)) * 4;
    const currentGridColor = imageData[testIndex] + imageData[testIndex + 1] + imageData[testIndex + 2];
    if (currentGridColor > 255) {
      return false;
    }
    const index = (x + (y * width)) * 4;
    imageData[testIndex] = imageData[index];
    imageData [testIndex + 1] = imageData[index + 1];
    imageData [testIndex + 2] = imageData[index + 2];
    imageData [testIndex + 3] = imageData[index + 3];

    imageData[index] = Math.max(imageData[index] - 50, 0);
    imageData[index + 1] = Math.max(imageData[index + 1] - 50, 0);
    imageData[index + 2] = Math.max(imageData[index + 2] - 50, 0);
    bacs[bacIndex] = {x: moveToX, y: moveToY, energy: Math.min(bacteriumMaxEnergy, bacs[bacIndex].energy + deltaTimeSec * 0.1)};

    return true;
  }

  private findSurroundingPlayer(x: number, y: number, width: number, height: number, colorToPlayer: { [p: string]: Player },
                                imageData: Uint8ClampedArray): { [p: number]: { amount: number, player: Player } } {
    // check if min 3 but more then own colors of N NE E SE S SW W NW are opponent colors
    const result: { [p: number]: { amount: number, player: Player } } = {};

    const rangeToTest = 2;

    const xMin = Math.max(x - rangeToTest, 0);
    const xMax = Math.min(x + rangeToTest, width);
    const yMin = Math.max(y - rangeToTest, 0);
    const yMax = Math.min(y + rangeToTest, height);

    for (let xi = xMin; xi <= xMax; xi++) {
      for (let yi = yMin; yi <= yMax; yi++) {
        if (xi !== x && yi !== y) {
          const [otherPlayer, energy] = this.playerOnCell(xi, yi, imageData, colorToPlayer, width);
          if (otherPlayer != null) {
            if (result[otherPlayer.id] == null) {
              result[otherPlayer.id] = {amount: 0, player: otherPlayer, energy: 0.};
            }
            result[otherPlayer.id].amount++;
            result[otherPlayer.id].energy += energy;
          }
        }
      }
    }

    return result;
  }

  private playerOnCell(x: number, y: number, imageData: Uint8ClampedArray, colorToPlayer: { [p: string]: Player }, width: number):
    [Player, number] {
    const testIndex = (x + (y * width)) * 4;
    const currentGridColor = [
      imageData[testIndex],
      imageData[testIndex + 1],
      imageData[testIndex + 2],
    ].toString();
    const alphaAsEnergy = imageData[testIndex + 3];
    return [colorToPlayer[currentGridColor], alphaAsEnergy / 255.];
  }
}
