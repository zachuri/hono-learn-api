// don't import from here, that's handled already
// instead this is just setting types for this folder

import type { AppType } from '@my/api'
import type { config } from '@my/ui'

export type AppConfig = typeof config
export type AppType = typeof AppType

declare module '@my/ui' {
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}
