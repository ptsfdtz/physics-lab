export interface MenuItem {
  label: string;
  path?: string;
  children?: MenuItem[];
}

export interface ParameterConfig {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  readonly?: boolean;
}

export interface AnimationControls {
  isPlaying: boolean;
  togglePlay: () => void;
  reset: () => void;
  time: number;
}
