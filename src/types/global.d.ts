/* eslint-disable @typescript-eslint/no-empty-interface */

import type { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      /** Brand to satisfy linters; has no effect on typings */
      _r3fBrand?: never;
    }
  }
}

export {};