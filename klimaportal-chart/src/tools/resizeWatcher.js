import debounce from './debounce'
import breakpoints from './breakpoints'

const bpPx = Object.values(breakpoints).sort((a, b) => b - a)

const bpNames = Object.fromEntries(
    Object.entries(breakpoints).map((a) => a.reverse()),
)

function ResizeWatcher() {
    const self = this
    self.listeners = []
}

ResizeWatcher.prototype.init = function init() {
    const self = this

    window.addEventListener(
        'resize',
        debounce(() => self.handleResize('resize'), 150).fn,
    )
    window.addEventListener(
        'orientationchange',
        debounce(() => self.handleResize('orientationchange'), 500).fn,
    )
}

ResizeWatcher.prototype.on = function on(callback) {
    const self = this

    if (self.listeners.indexOf(callback) > -1) {
        return
    }

    self.listeners.push(callback)

    return () => self.off(callback)
}

ResizeWatcher.prototype.off = function off(callback) {
    const self = this
    const index = self.listeners.indexOf(callback)

    if (index === -1) {
        return
    }

    self.listeners.splice(index, 1)
}

ResizeWatcher.prototype.getData = function getData(eventName = '') {
    const self = this
    const width = window.innerWidth

    let breakpoint
    for (const px of bpPx) {
        if (width >= px) {
            breakpoint = bpNames[px]
            break
        }
    }

    return {
        name: eventName,
        width,
        height: window.innerHeight,
        breakpoint,
        orientation:
            window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
        lastData: self.data,
    }
}

ResizeWatcher.prototype.handleResize = function handleResize(eventName) {
    const self = this
    const data = self.getData()
    self.lastData = data

    console.log(
        `resizeWatcher: ${eventName} detected`,
        `(${self.listeners.length})`,
    )

    self.listeners.forEach((callback) => callback(data))
}

const resizeWatcher = new ResizeWatcher()
export default resizeWatcher
