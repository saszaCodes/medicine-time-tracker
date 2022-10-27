import { theme } from "./theme";

type Theme = typeof theme

type DefaultThemeType = {
  [key in keyof Theme]: Theme[key]
}

declare module "styled-components/native" {
  export interface DefaultTheme extends DefaultThemeType
}
