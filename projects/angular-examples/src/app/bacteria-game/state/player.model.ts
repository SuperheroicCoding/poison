import {ID} from '@datorama/akita';

export type PlayerColorArray = [number, number, number, number];

export const bacteriumMaxEnergy = 1.;
export const bacteriumEnergyRestoreTimeInSec = 5;


  export interface Player {
  id: ID;
  x: number;
  y: number;
  color: PlayerColorArray;
  maxSpeed: number; // px / second
  bacterias: Bacteria[];
}


export interface Bacteria {
  x: number;
  y: number;
  energy: number;
}

let playerId = 0;

/**
 * A factory function that creates Player
 */
export function createPlayer(params: Partial<Player>): Player {
  return {
    id: playerId++,
    maxSpeed: 100,
    ...params
  } as Player;
}

export function createPlayerWithBacterias(id: ID, x: number, y: number, color: PlayerColorArray, startBacteriaRadius: number): Player {
  return createPlayer({id, x, y, color, bacterias: createPlayerBacterias(x, y, startBacteriaRadius)});
}

function createPlayerBacterias(x, y, startBacteriaRadius): Bacteria[] {
  const result = [];
  const rPow = startBacteriaRadius * startBacteriaRadius;
  for (let i = 0; i < startBacteriaRadius * 2; i++) {
    for (let j = 0; j < startBacteriaRadius * 2; j++) {
      const testX = (i - startBacteriaRadius);
      const testY = (j - startBacteriaRadius);

      if ((testX * testX) + (testY * testY) <= rPow) {

        const bac = {x: testX + x, y: testY + y, energy: bacteriumMaxEnergy};
        result.push(bac);
      }
    }
  }
  return result;
}

