export interface Camera {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  source: 'urbanas' | 'm30' | 'radares' | 'dgt';
  type: 'camera' | 'radar';
  radarType?: string;
  maxSpeed?: string;
}

export interface FilterState {
  urbanas: boolean;
  m30: boolean;
  radares: boolean;
  dgt: boolean;
}
