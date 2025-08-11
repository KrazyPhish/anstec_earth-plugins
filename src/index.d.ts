import { type Earth } from "@anstec/earth"

declare module "@anstec/earth-plugins" {
  export const registerEChartsOverlay: (earth: Earth) => void
}
