/**
 * @description 属性可枚举装饰器
 * @param value 值
 */
export const enumerable: (value: boolean) => {
  (target: object, prop: string | symbol): void
  <T>(target: object, prop: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void
} = (value) => {
  return (...args: Parameters<MethodDecorator> | Parameters<PropertyDecorator>) => {
    const [target, prop, descriptor] = args
    if (descriptor) {
      descriptor.enumerable = true
      descriptor.configurable = false
      return descriptor
    } else {
      Object.defineProperty(target, prop, {
        configurable: false,
        enumerable: value,
        writable: true,
      })
    }
  }
}
