import { ResourceLocationDefaultOption } from './ResourceLocation.ts';
import { ResourceLocation, RawResourceLocation } from './mod.ts';

export class ResourceWithDetails extends ResourceLocation {
  hash: string;
  url: URL;
  constructor (rawResourceLocation: RawResourceLocation, url: string | URL, hash: string, option?: ResourceLocationDefaultOption) {
    super(rawResourceLocation, option);

    if (typeof url === 'string') {
      this.url = new URL(url);
    } else {
      this.url = url;
    }

    this.hash = hash;
  }
}
