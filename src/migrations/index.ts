import * as migration_20250929_111647 from './20250929_111647';
import * as migration_20251106_080505 from './20251106_080505';
import * as migration_20251106_100956 from './20251106_100956';
import * as migration_20251121_232945 from './20251121_232945';

export const migrations = [
  {
    up: migration_20250929_111647.up,
    down: migration_20250929_111647.down,
    name: '20250929_111647',
  },
  {
    up: migration_20251106_080505.up,
    down: migration_20251106_080505.down,
    name: '20251106_080505',
  },
  {
    up: migration_20251106_100956.up,
    down: migration_20251106_100956.down,
    name: '20251106_100956',
  },
  {
    up: migration_20251121_232945.up,
    down: migration_20251121_232945.down,
    name: '20251121_232945'
  },
];
