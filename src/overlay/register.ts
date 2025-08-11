import type { Earth } from "@anstec/earth"
import { Scene, Cartesian3, SceneMode, Cartesian2, Cartographic, Math } from "cesium"
import {
  extendComponentModel,
  extendComponentView,
  ComponentModel,
  graphic,
  matrix,
  registerAction,
  type CustomSeriesRenderItemAPI,
} from "echarts"

export const registerEChartsOverlay = (earth: Earth) => {
  extendComponentModel({
    type: "GLMap",
    defaultOption: {
      roam: false,
    },
  })

  extendComponentView({
    type: "GLMap",
    init(_: any, api: CustomSeriesRenderItemAPI) {
      //@ts-ignore
      this.api = api
      //@ts-ignore
      earth._scene.postRender.addEventListener(this.moveHandler, this)
    },
    moveHandler() {
      //@ts-ignore
      this.api.dispatchAction({ type: "GLMapRoam" })
    },
    render() {},
    dispose() {
      //@ts-ignore
      earth._scene.postRender.removeEventListener(this.moveHandler, this)
    },
  })

  class EarthCoordinateSystem {
    static dimensions = ["lng", "lat"]
    dimensions = ["lng", "lat"]
    scene: Scene
    mapOffset = [0, 0]
    api: CustomSeriesRenderItemAPI
    constructor(scene: Scene, api: CustomSeriesRenderItemAPI) {
      this.scene = scene
      this.api = api
    }

    static create(globalModel: any, api: CustomSeriesRenderItemAPI) {
      let coordSys: EarthCoordinateSystem
      globalModel.eachComponent("GLMap", (earthModel: ComponentModel) => {
        //@ts-ignore
        coordSys = new EarthCoordinateSystem(earth._scene, api)
        //@ts-ignore
        coordSys.setMapOffest(earthModel.__mapOffest || [0, 0])
        //@ts-ignore
        earthModel.coordinateSystem = coordSys
      })

      globalModel.eachSeries((seriesModel: any) => {
        if (seriesModel.get("coordinateSystem") === "GLMap") {
          seriesModel.coordinateSystem = coordSys
        }
      })
    }

    setMapOffest(offset: number[]) {
      this.mapOffset = [...offset]
    }

    getEarthMap() {
      return this.scene
    }

    /**
     * @description 数据坐标转坐标点
     * @param data 坐标
     */
    dataToPoint(data: number[]) {
      const maxRadians = Math.toRadians(80)
      const position = Cartesian3.fromDegrees(data[0], data[1])
      if (!position) return [undefined, undefined]
      const canvasCoordinate = this.scene.cartesianToCanvasCoordinates(position)
      if (!canvasCoordinate) return [undefined, undefined]
      if (
        this.scene.mode === SceneMode.SCENE3D &&
        Cartesian3.angleBetween(this.scene.camera.position, position) > maxRadians
      ) {
        return [undefined, undefined]
      }
      return [canvasCoordinate.x - this.mapOffset[0], canvasCoordinate.y - this.mapOffset[1]]
    }

    /**
     * @description 坐标点转数据坐标
     * @param point 点
     */
    pointToData(point: number[]) {
      const pt = new Cartesian2(point[0] + this.mapOffset[0], point[1] + this.mapOffset[1])
      const cartesian = this.scene.pickPosition(pt)
      if (!cartesian) return [undefined, undefined]
      const carto = Cartographic.fromCartesian(cartesian)
      return [carto.longitude, carto.latitude]
    }

    /**
     * @description 获取视窗
     * @returns 视窗
     */
    getViewRect(): graphic.BoundingRect {
      const rect = new graphic.BoundingRect(0, 0, this.api.getWidth(), this.api.getHeight())
      return rect
    }

    getRoamTransform() {
      return matrix.create()
    }
  }

  //@ts-ignore
  registerCoordinateSystem("GLMap", EarthCoordinateSystem)

  registerAction(
    {
      type: "GLMapRoam",
      event: "GLMapRoam",
      update: "updateLayout",
    },
    () => {}
  )
}
