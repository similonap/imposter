import * as _ from "lodash";
import seedrandom from "seedrandom";

//settings
const GRID_HEIGHT = 100;
const GRID_WIDTH = 100;
const MAX_ROOMS = 10;
const ROOM_SIZE_RANGE = [15, 40];

const c = { GRID_HEIGHT, GRID_WIDTH, MAX_ROOMS, ROOM_SIZE_RANGE };

const random = (rng: any, min: number, max: number) => {
  if (min < 1 || max < 1) {
    return rng() * (max - min) + min;
  }
  return Math.floor(rng() * (max - min + 1)) + min;

}

export interface Room {
  x: number,
  y: number,
  width: number,
  height: number
}

export interface Position {
  x: number,
  y: number
}

export interface Dungeon {
  grid: GameTile[][],
  rooms: Room[]
}

export interface GameTile {
  type: 'floor' | 'door' | 'space',
  opacity: number
}

export interface Object { 
  name: string,
  position: Position
}

export const createObjects = (dungeon: Dungeon, seed: string): Object[] => {
  let rng = seedrandom(seed);

  return dungeon.rooms.map((room: Room) => {
    let x = random(rng, room.x+1, room.x + room.width-1);
    let y = random(rng, room.y+1, room.y + room.height-1);
    return {
      name: 'switch',
      position: {x,y}
    }
  });
}

export const createDungeon = (seed: string = 'initialSeed'): Dungeon => {
  let rng = seedrandom(seed);
  // HELPER FUNCTIONS FOR CREATING THE MAP
  const isValidRoomPlacement = (grid: any, { x, y, width = 1, height = 1 }: any) => {
    // check if on the edge of or outside of the grid
    if (y < 1 || y + height > grid.length - 1) {
      return false;
    }
    if (x < 1 || x + width > grid[0].length - 1) {
      return false;
    }

    // check if on or adjacent to existing room
    for (let i = y - 1; i < y + height + 1; i++) {
      for (let j = x - 1; j < x + width + 1; j++) {
        if (grid[i][j].type === 'floor') {
          return false;
        }
      }
    }
    // all grid cells are clear
    return true;
  };

  const placeCells = (grid: any, { x, y, width = 1, height = 1, id }: any, type = 'floor') => {
    for (let i = y; i < y + height; i++) {
      for (let j = x; j < x + width; j++) {
        grid[i][j] = { type, id };
      }
    }
    return grid;
  };

  const createRoomsFromSeed = (grid: any, { x, y, width, height }: any, range = c.ROOM_SIZE_RANGE): Dungeon => {
    // range for generating the random room heights and widths
    const [min, max] = range;

    // generate room values for each edge of the seed room
    const roomValues = [];

    const north: any = { height: random(rng, min, max), width: random(rng, min, max) };
    north.x = random(rng, x, x + width - 1);
    north.y = y - north.height - 1;
    north.doorx = random(rng, north.x, (Math.min(north.x + north.width, x + width)) - 1);
    north.doory = y - 1;
    north.id = 'N';
    roomValues.push(north);

    const east: any = { height: random(rng, min, max), width: random(rng, min, max) };
    east.x = x + width + 1;
    east.y = random(rng, y, height + y - 1);
    east.doorx = east.x - 1;
    east.doory = random(rng, east.y, (Math.min(east.y + east.height, y + height)) - 1);
    east.id = 'E';
    roomValues.push(east);

    const south: any = { height: random(rng, min, max), width: random(rng, min, max) };
    south.x = random(rng, x, width + x - 1);
    south.y = y + height + 1;
    south.doorx = random(rng, south.x, (Math.min(south.x + south.width, x + width)) - 1);
    south.doory = y + height;
    south.id = 'S';
    roomValues.push(south);

    const west: any = { height: random(rng, min, max), width: random(rng, min, max) };
    west.x = x - west.width - 1;
    west.y = random(rng, y, height + y - 1);
    west.doorx = x - 1;
    west.doory = random(rng, west.y, (Math.min(west.y + west.height, y + height)) - 1);
    west.id = 'W';
    roomValues.push(west);

    const rooms: Room[] = [];
    roomValues.forEach(room => {
      if (isValidRoomPlacement(grid, room)) {
        // place room
        grid = placeCells(grid, room);

        // place door
        grid = placeCells(grid, { x: room.doorx, y: room.doory }, 'door');
        // need placed room values for the next seeds
        rooms.push(room);
      }
    });
    return { grid, rooms };
  };

  // BUILD OUT THE MAP

  // 1. make a grid of 'empty' cells, with a random opacity value (for styling)
  let grid: any[] = [];
  for (let i = 0; i < c.GRID_HEIGHT; i++) {
    grid.push([]);
    for (let j = 0; j < c.GRID_WIDTH; j++) {
      grid[i].push({ type: 'space', opacity: random(rng, 0.3, 0.8) });
    }
  }

  // 2. random values for the first room
  const [min, max] = c.ROOM_SIZE_RANGE;
  const firstRoom = {
    x: random(rng, 1, c.GRID_WIDTH - max - 15),
    y: random(rng, 1, c.GRID_HEIGHT - max - 15),
    height: random(rng, min, max),
    width: random(rng, min, max),
    id: 'O'
  };

  // 3. place the first room on to grid
  grid = placeCells(grid, firstRoom);

  // 4. using the first room as a seed, recursivley add rooms to the grid
  const growMap = (grid: any, seedRooms: any, counter = 1, maxRooms = c.MAX_ROOMS, rooms: Room[]): Dungeon  => {
    if (counter + seedRooms.length > maxRooms || !seedRooms.length) {
      return { grid, rooms };
    }

    grid = createRoomsFromSeed(grid, seedRooms.pop());
    seedRooms.push(...grid.rooms);
    counter += grid.rooms.length;
    return growMap(grid.grid, seedRooms, counter, c.MAX_ROOMS, [...rooms, ...grid.rooms]);
  };
  let tuple = growMap(grid, [firstRoom], 1, c.MAX_ROOMS, []);


  return { grid: tuple.grid, rooms: tuple.rooms };
};