export type CanvasMode = 'fixed' | 'scaled' | 'native';

export type CanvasConfig = 
  | { mode: 'fixed'; width: number; height: number; pixelArt?: boolean }
  | { mode: 'scaled'; width: number; height: number }
  | { mode: 'native' };
