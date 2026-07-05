import { ExpoFetchModule } from './ExpoFetchModule';

export function isReactNativeBlobGlobal(): boolean {
  try {
    return globalThis.Blob === require('react-native/Libraries/Blob/Blob').default;
  } catch {
    return false;
  }
}

/**
 * react-native's `Blob` cannot hold binary data created in JS: its constructor
 * only accepts string and `Blob` parts, and strings are stored natively as
 * UTF-8 text. Instead, store the bytes in react-native's native blob store
 * and create the `Blob` from the store reference, like XHR responses do.
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
