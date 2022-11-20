let timeoutId

self.onmessage = ({ data }) => {
  if (data.type === 'start') {
    timeoutId = setInterval(() => postMessage('tick'), data.interval || 1000)
  } else if (data.type === 'stop') {
    clearInterval(timeoutId)
  }
}
