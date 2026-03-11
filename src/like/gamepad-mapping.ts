// Gamepad button mapping layer
// Bridges SDL database mappings with our internal button naming system

import { gamepadDatabase, ControllerMapping } from './gamepad-db.ts';
import { getButtonIndex } from './gamepad-button-map.ts';

// Map SDL button names to our internal button names
const SDL_TO_INTERNAL_BUTTON: Record<string, string> = {
  // Face buttons
  'a': 'ButtonBottom',
  'b': 'ButtonRight',
  'x': 'ButtonLeft',
  'y': 'ButtonTop',

  // Bumpers and triggers
  'leftshoulder': 'LB',
  'rightshoulder': 'RB',
  'lefttrigger': 'LT',
  'righttrigger': 'RT',

  // Menu buttons
  'back': 'Back',
  'start': 'Start',
  'guide': 'Guide',

  // Stick presses
  'leftstick': 'LS',
  'rightstick': 'RS',

  // D-Pad
  'dpup': 'DPadUp',
  'dpdown': 'DPadDown',
  'dpleft': 'DPadLeft',
  'dpright': 'DPadRight',

  // Misc buttons
  'misc1': 'Misc1',
  'misc2': 'Misc2',
  'paddle1': 'Paddle1',
  'paddle2': 'Paddle2',
  'paddle3': 'Paddle3',
  'paddle4': 'Paddle4',
  'touchpad': 'Touchpad',
};

// Reverse mapping: internal to SDL
const INTERNAL_TO_SDL_BUTTON: Record<string, string> = {};
for (const [sdl, internal] of Object.entries(SDL_TO_INTERNAL_BUTTON)) {
  INTERNAL_TO_SDL_BUTTON[internal] = sdl;
}

export interface ButtonMapping {
  // Maps controller-specific button index to standard button index
  toStandard: Map<number, number>;
  // Maps standard button index to controller-specific button index
  fromStandard: Map<number, number>;
  // Controller info
  controllerName: string;
  hasMapping: boolean;
}

export class GamepadMapping {
  private mappings = new Map<string, ButtonMapping>();
  private dbLoaded = false;

  /**
   * Load the game controller database
   * In a browser environment, this should be called with the file content
   */
  async loadDatabase(): Promise<void> {
    if (this.dbLoaded) {
      console.log('[GamepadMapping] Database already loaded');
      return;
    }

    console.log('[GamepadMapping] Loading database...');

    try {
      // In a browser/Vite environment, fetch the text file
      console.log('[GamepadMapping] Trying fetch...');
      const response = await fetch('/like/gamecontrollerdb.txt');
      console.log('[GamepadMapping] Fetch response status:', response.status, response.ok);
      if (response.ok) {
        const content = await response.text();
        console.log('[GamepadMapping] Fetch successful, content length:', content.length);
        gamepadDatabase.load(content);
        this.dbLoaded = true;
        console.log('[GamepadMapping] Database loaded successfully via fetch');
        return;
      } else {
        console.log('[GamepadMapping] Fetch failed with status:', response.status);
      }
    } catch (e) {
      console.log('[GamepadMapping] Fetch threw error:', e);
    }

    // Try relative fetch as fallback
    try {
      console.log('[GamepadMapping] Trying relative fetch...');
      const response = await fetch('./gamecontrollerdb.txt');
      console.log('[GamepadMapping] Relative fetch response status:', response.status, response.ok);
      if (response.ok) {
        const content = await response.text();
        console.log('[GamepadMapping] Relative fetch successful, content length:', content.length);
        gamepadDatabase.load(content);
        this.dbLoaded = true;
        console.log('[GamepadMapping] Database loaded successfully via relative fetch');
        return;
      }
    } catch (e) {
      console.log('[GamepadMapping] Relative fetch threw error:', e);
    }

    // If fetch fails, try to load from Vite's raw import
    console.log('[GamepadMapping] Trying Vite raw import...');
    try {
      // Use ?raw suffix to import as string
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Vite handles ?raw imports
      const module = await import('./gamecontrollerdb.txt?raw');
      console.log('[GamepadMapping] Import result:', module);
      if (typeof module.default === 'string') {
        console.log('[GamepadMapping] Import successful, content length:', module.default.length);
        gamepadDatabase.load(module.default);
        this.dbLoaded = true;
        console.log('[GamepadMapping] Database loaded successfully via import');
      } else {
        console.log('[GamepadMapping] Import did not return string, got:', typeof module.default);
      }
    } catch (importError) {
      console.warn('[GamepadMapping] Could not load game controller database:', importError);
    }

    console.log('[GamepadMapping] Database loaded flag:', this.dbLoaded);
    if (this.dbLoaded) {
      const platform = navigator.platform.includes('Win') ? 'Windows' :
                       navigator.platform.includes('Mac') ? 'Mac OS X' : 'Linux';
      const platformMappings = gamepadDatabase.getMappingsByPlatform(platform);
      console.log(`[GamepadMapping] Loaded ${gamepadDatabase.getMappingCount()} total mappings, ${platformMappings.length} for ${platform}`);
    }
  }

  /**
   * Load database from raw text content
   */
  loadDatabaseFromText(content: string): void {
    gamepadDatabase.load(content);
    this.dbLoaded = true;
  }

  /**
   * Get or create a button mapping for a specific gamepad
   */
  getMapping(gamepad: Gamepad): ButtonMapping {
    // Use the gamepad's id as a key (this contains the GUID in most browsers)
    const key = `${gamepad.id}_${gamepad.index}`;

    if (this.mappings.has(key)) {
      return this.mappings.get(key)!;
    }

    const mapping = this.createMapping(gamepad);
    this.mappings.set(key, mapping);
    return mapping;
  }

  /**
   * Clear all cached mappings
   */
  clear(): void {
    this.mappings.clear();
  }

  /**
   * Create a new button mapping for a gamepad
   */
  private createMapping(gamepad: Gamepad): ButtonMapping {
    const toStandard = new Map<number, number>();
    const fromStandard = new Map<number, number>();

    // Try to find a mapping in the database
    const dbMapping = this.findDatabaseMapping(gamepad);

    if (dbMapping) {
      // Use the database mapping
      for (const [sdlButton, controllerButtonIndex] of dbMapping.buttons) {
        const internalName = SDL_TO_INTERNAL_BUTTON[sdlButton];
        if (internalName) {
          const standardIndex = getButtonIndex(internalName);
          if (standardIndex !== undefined) {
            toStandard.set(controllerButtonIndex, standardIndex);
            fromStandard.set(standardIndex, controllerButtonIndex);
          }
        }
      }

      return {
        toStandard,
        fromStandard,
        controllerName: dbMapping.name,
        hasMapping: true,
      };
    }

    // No database mapping found - use default Xbox-style layout
    // This assumes the browser already normalized the layout
    for (let i = 0; i < gamepad.buttons.length; i++) {
      toStandard.set(i, i);
      fromStandard.set(i, i);
    }

    return {
      toStandard,
      fromStandard,
      controllerName: gamepad.id,
      hasMapping: false,
    };
  }

  /**
   * Try to find a database mapping for the gamepad
   */
  private findDatabaseMapping(gamepad: Gamepad): ControllerMapping | undefined {
    if (!this.dbLoaded) {
      console.log('[GamepadMapping] Database not loaded yet');
      return undefined;
    }

    console.log('[GamepadMapping] Looking for mapping for gamepad:', gamepad.id);

    const vp = this.extractVendorProduct(gamepad);
    if (vp) {
      console.log('[GamepadMapping] Looking up by vendor/product:', `0x${vp.vendor.toString(16).padStart(4,'0')}:0x${vp.product.toString(16).padStart(4,'0')}`, `(key: ${0x10000 * vp.vendor + vp.product})`);
      const mapping = gamepadDatabase.getMappingByVendorProduct(vp.vendor, vp.product);
      if (mapping) {
        console.log('[GamepadMapping] Found mapping:', mapping.name);
        return mapping;
      }
    }

    console.log('[GamepadMapping] No mapping found, using default Xbox layout');
    return undefined;
  }

  private extractVendorProduct(gamepad: Gamepad): { vendor: number; product: number } | null {
    const id = gamepad.id;

    const vendorProductMatch = id.match(/Vendor:\s*([0-9a-fA-F]+)\s+Product:\s*([0-9a-fA-F]+)/i);
    if (vendorProductMatch) {
      const vendor = parseInt(vendorProductMatch[1], 16);
      const product = parseInt(vendorProductMatch[2], 16);
      if (!isNaN(vendor) && !isNaN(product)) {
        return { vendor, product };
      }
    }

    const hexMatch = id.match(/^([0-9a-fA-F]{4})[\s-]+([0-9a-fA-F]{4})/);
    if (hexMatch) {
      const vendor = parseInt(hexMatch[1], 16);
      const product = parseInt(hexMatch[2], 16);
      if (!isNaN(vendor) && !isNaN(product)) {
        return { vendor, product };
      }
    }

    console.log('[GamepadMapping] Could not extract vendor/product from id');
    return null;
  }
}

// Singleton instance
export const gamepadMapping = new GamepadMapping();
export default gamepadMapping;
