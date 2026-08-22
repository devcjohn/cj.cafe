const getIP = () => {
  const peerConnection = new RTCPeerConnection({ iceServers: [] })
  peerConnection.createDataChannel('')

  peerConnection
    .createOffer()
    .then((offer) => peerConnection.setLocalDescription(offer))
    .catch((error) => console.log(error))

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      return event.candidate.address
    }
  }
  return null
}

export const WhatIKnowAboutYou = () => {
  const timing = window.performance.timing
  const timingKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(timing))

  const perf = timingKeys
    .map((k) => {
      const val = (window.performance.timing as never)[k]
      const actualVal = typeof val === 'number' && !!val ? val : null
      if (!actualVal) {
        return null
      }
      const deltaMs = actualVal - window.performance.timeOrigin
      const deltaDate = new Date(deltaMs)
      return {
        k,
        raw: actualVal,
        val: new Date(actualVal).getMilliseconds(),
        deltaMs: deltaMs,
        human: deltaDate.getSeconds() + '.' + deltaDate.getMilliseconds() + 's',
      }
    })
    .filter((x) => x)
    .sort((a, b) => a!.raw - b!.raw)

  const timeToInteractive = perf.find((x) => x!.k === 'domInteractive')!.human
  const timeToComplete = perf.find((x) => x!.k === 'domContentLoadedEventEnd')!.human
  const performanceEntries = perf.map((x) => x!.k + ' : ' + x!.human)

  // Alternate way to get performance data keys/data
  //const performanceEntries = performance.getEntriesByType('navigation')

  const props = {
    ip: getIP(),
    language: navigator.language,
    Clipboard: navigator.clipboard.readText().then((x) => x),
    languages: navigator.languages,
    webDriver: navigator.webdriver,
    timeToInteractive,
    timeToComplete,
    glob: window.global,
    devicePixelRatio: window.devicePixelRatio,
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
    locationbarVisibility: window.locationbar.visible,
    menubarVisibility: window.menubar.visible,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    hardwareConcurrency: navigator.hardwareConcurrency,
    maxTouchPoints: navigator.maxTouchPoints,
    onLine: navigator.onLine,
    pdfViewerEnabled: navigator.pdfViewerEnabled,
    userAgent: navigator.userAgent,
    activeElement: document.activeElement,
    isConnected: document.isConnected,
    lastModified: document.lastModified,
    readyState: document.readyState,
    referrer: document.referrer,
    currentTime: document.timeline.currentTime,
    geo: navigator.geolocation.getCurrentPosition((x) => x),
  }

  const deprecatedOrExperimentalProps = {
    appName: navigator.appVersion,
    platform: navigator.platform,
    product: navigator.product,
    productSub: navigator.productSub,
    performanceEntries,
    //@ts-expect-error - it does exist, its experimental
    userAgentData: navigator.userAgentData,
    gpu: !navigator.gpu ? 'WebGPU not supported' : navigator.gpu,
    //@ts-expect-error - it does exist, its experimental
    ink: navigator.ink,
  }
  return (
    <>
      <h1 className="text-4xl"> Props from your browser</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
      <h1 className="text-4xl"> Deprecated or experimental props from your browser</h1>
      <h2 className="text-2xl">These may not work in all browsers</h2>
      <pre>{JSON.stringify(deprecatedOrExperimentalProps, null, 2)}</pre>
    </>
  )
}
