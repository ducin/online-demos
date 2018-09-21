function resizeIframe(obj) {
  obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}

const setIframeSrc = (src) => {
  const url = window.location.href.split('#')[0] + src + '/'
  document.getElementById('screen').src = url
}

const IFrameLinks = {
  'nav-slider': 'headline-slider',
  'nav-exchange': 'currency-exchange',
  'nav-waves': 'waves',
  'nav-timer': 'timer',
  'nav-reactive': 'reactive-panel'
}

const resetActive = (() => {
  const liElements = Object.keys(IFrameLinks)
    .map(nodeId => document.getElementById(nodeId).parentElement)
  return () => {
    liElements.forEach(li => li.classList.remove('active'))
  }
})()

Object.entries(IFrameLinks).forEach(([nodeId, IFrameSrc]) => {
  const node = document.getElementById(nodeId)
  node.addEventListener('click', () => {
    setIframeSrc(IFrameSrc)
    resetActive()
    node.parentElement.classList.add('active')
  })
})
