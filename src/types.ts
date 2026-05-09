export type CategoryKey = 
  | 'videoStyle'
  | 'environment'
  | 'cameraMotion'
  | 'lighting'
  | 'visualVfx'
  | 'soundSfx'
  | 'dialect';

export interface PromptConfig {
  scenario: string;
  background: string;
  characters: string;
  dialogue: string;
  videoStyle: string;
  environment: string;
  cameraMotion: string;
  lighting: string;
  visualVfx: string;
  soundSfx: string;
  dialect: string;
  aiModel: string;
  applyTashkeel: boolean;
}
