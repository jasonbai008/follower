/**
 * 鼠标跟随插件
 * 
 * 使用示例：
 * 1. 引入插件
 * import Follower from './follower.js'
 * 
 * 2. 实例化并配置
 * const follower = new Follower({
 *   size: 30,                           // 圆环默认大小
 *   borderColor: '#999',                // 边框颜色
 *   borderWidth: 1,                     // 边框宽度
 *   hoverSize: 50,                      // hover时圆环大小
 *   hoverColor: 'rgba(0, 255, 0, 0.3)', // hover时背景色
 *   speed: 0.15                         // 跟随速度(0-1之间)
 * })
 * 
 * 3. 销毁实例
 * follower.destroy()
 */

class Follower {
  constructor(options = {}) {
    // 默认配置
    this.options = {
      size: 30,
      borderColor: '#999',
      borderWidth: 1,
      hoverSize: 50,
      hoverColor: 'rgba(0, 255, 0, 0.3)',
      speed: 0.15,
      ...options
    }

    // 初始化状态
    this.mouseX = window.innerWidth / 2
    this.mouseY = window.innerHeight / 2
    this.cursorX = this.mouseX
    this.cursorY = this.mouseY
    this.isHover = false
    this.animationFrameId = null

    // 创建DOM元素
    this.createCursor()
    // 绑定事件
    this.bindEvents()
    // 启动动画
    this.startAnimation()
  }

  // 创建跟随光标的DOM元素
  createCursor() {
    this.cursor = document.createElement('div')
    this.cursor.className = 'custom_cursor'
    // 添加基础样式
    Object.assign(this.cursor.style, {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: '9999',
      transform: 'translate(-50%, -50%)',
      transition: 'width 0.15s ease-out, height 0.15s ease-out, background-color 0.15s ease-out, border 0.15s ease-out',
      borderRadius: '50%'
    })
    // 更新光标样式
    this.updateCursorStyle()
    // 添加到页面
    document.body.appendChild(this.cursor)
  }

  // 更新光标样式
  updateCursorStyle() {
    const size = this.isHover ? this.options.hoverSize : this.options.size
    Object.assign(this.cursor.style, {
      width: `${size}px`,
      height: `${size}px`,
      border: this.isHover ? 'none' : `${this.options.borderWidth}px solid ${this.options.borderColor}`,
      backgroundColor: this.isHover ? this.options.hoverColor : 'transparent',
      left: `${this.cursorX}px`,
      top: `${this.cursorY}px`
    })
  }

  // 绑定事件
  bindEvents() {
    // 使用箭头函数绑定this
    this.handleMouseMove = (e) => {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
      
      const targetElement = e.target
      const cursorStyle = window.getComputedStyle(targetElement).cursor
      this.isHover = cursorStyle === 'pointer'
      this.updateCursorStyle()
    }

    this.handleMouseLeave = () => {
      this.cursor.style.opacity = '0'
    }

    this.handleMouseEnter = () => {
      this.cursor.style.opacity = '1'
    }

    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseleave', this.handleMouseLeave)
    document.addEventListener('mouseenter', this.handleMouseEnter)
  }

  // 启动动画
  startAnimation() {
    const animate = () => {
      // 使用线性插值实现平滑跟随
      this.cursorX += (this.mouseX - this.cursorX) * this.options.speed
      this.cursorY += (this.mouseY - this.cursorY) * this.options.speed
      
      // 更新位置
      this.cursor.style.left = `${this.cursorX}px`
      this.cursor.style.top = `${this.cursorY}px`

      this.animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  }

  // 销毁实例
  destroy() {
    // 移除事件监听
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseleave', this.handleMouseLeave)
    document.removeEventListener('mouseenter', this.handleMouseEnter)
    
    // 取消动画
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
    
    // 移除DOM元素
    if (this.cursor && this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor)
    }
  }
}

// 导出插件
export default Follower
