import { useCallback, useEffect, useRef } from "react"

export default function useAbortController() {
    const abortControllerRef = useRef<AbortController>()
    const getAbortController = useCallback(() => {
      if (!abortControllerRef?.current) {
        abortControllerRef.current = new AbortController()
      }
      return abortControllerRef.current
    }, [])
  
    useEffect(() => {
      return () => getAbortController().abort()
    }, [getAbortController])
  
    const getSignal = useCallback(() => getAbortController().signal, [
      getAbortController,
    ])
  
    return getSignal
  }