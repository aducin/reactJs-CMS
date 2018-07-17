export default function (callback) {
  return this.then(
      value => this.constructor.resolve(callback()).then(() => value),
  reason => this.constructor.resolve(callback()).then(() => { throw reason })
  )
}
