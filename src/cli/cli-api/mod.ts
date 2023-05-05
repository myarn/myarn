import { ResourceLocation } from '../../utils/ResourceLocation.ts';

export interface ResourceWithDisplay<D> {
  display: D;
  resource: ResourceLocation;
}

export * from './installResources.ts';
export * from './download.ts';
