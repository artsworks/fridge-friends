import { afterEach, describe, expect, it, vi } from 'vitest';
import { FACE_TEXTURE_SIZE, faceTexture } from './faceTexture';

afterEach(() => vi.unstubAllGlobals());

describe('face texture budget', () => {
  it('uses a shared 128px canvas with bounded anisotropy', () => {
    vi.stubGlobal('document', {
      createElement: () => ({ width: 0, height: 0, getContext: () => null }),
    });
    const texture = faceTexture('blink', undefined);
    expect(FACE_TEXTURE_SIZE).toBe(128);
    expect(texture.image.width).toBe(128);
    expect(texture.image.height).toBe(128);
    expect(texture.anisotropy).toBe(2);
    expect(faceTexture('blink', undefined)).toBe(texture);
  });
});
