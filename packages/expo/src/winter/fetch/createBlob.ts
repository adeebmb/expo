import { ExpoFetchModule } from './ExpoFetchModule';

export function isReactNativeBlobGlobal(): boolean {
  try {
    return globalThis.Blob === require('react-native/Libraries/Blob/Blob').default;
  } catch {
    return false;
  }
}

/**
 * react-native's `Blob` cannot be created from binary data in JS, so store the
 * bytes in its native blob store and reference them, like XHR responses do.
 */
export async function createReactNativeBlobAsync(buffer: ArrayBuffer, type: string): Promise<Blob> {
  const BlobManager = require('react-native/Libraries/Blob/BlobManager').default;
  const blobId: string = await ExpoFetchModule.storeBlobData(new Uint8Array(buffer));
  return BlobManager.createFromOptions({
    blobId,
    offset: 0,
    size: buffer.byteLength,
    type,
    lastModified: Date.now(),
  });
}
