// 发布定于模式demo
class EventEmitter {
  constructor() {
    this.listeners = {
      // study:function(){console.log('goodgoodstudy')}
    } // 定义监听者，处理监听事件
  }
  on(functonType, event) {
    // 先判断listteners中是否已经监听该事件/类型
    if (!this.listeners[functonType]) {
      // 如果listeners中没有该事件类型 则添加该事件类型 注册 该类型事件
      this.listeners[functonType] = []
    }
    this.listeners[functonType].push(event) // 将该事件类型添加 触发event
  }
  emit(functonType, ...arg) {
    if (this.listeners[functonType]) {
      this.listeners[functonType].forEach(event => {
        event(...arg) // emit事件放入执行
      })
    }
  }
}
const BusEmit = new EventEmitter()
export default BusEmit
// BusEmit.on('监听事件名字/类型','绑定的事件')
// BusEmit.emit('监听事件名字/类型','参数')
