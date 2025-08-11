## @anstec/earth-plugins

Plugins for module [@anstec/earth](https://www.npmjs.com/package/@anstec/earth).

### Before start

Before start using this module, install packages blow manually: [@anstec/earth](https://www.npmjs.com/package/@anstec/earth).

Then install this module:  
```shell
npm install @anstec/earth-plugins
```

### Get started

To use plugin echarts overlay:

```ts
// in your map module, when initializing the cesium viewer
import { type Earth, createEarth } from "@anstec/earth"
import { registerEChartsOverlay, EChartsOverlay } from "@anstec/earth-plugins"

const earth: Earth = createEarth()

// register echarts overlay, to syncronize the coordinate with cesium viewer
registerEChartsOverlay(earth)

// then create the echarts overlay
const overlay = new EChartsOverlay(earth, { option: { /** your echarts option */ } })

```