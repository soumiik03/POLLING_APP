import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

export function useSocket(pollId, onNewResponse) {
  const socketRef = useRef(null)

  useEffect(() => {
    if (!pollId) return

    socketRef.current = io('http://localhost:5000')
    socketRef.current.emit('join_poll', pollId)
    socketRef.current.on('new_response', onNewResponse)

    return () => {
      socketRef.current.disconnect()
    }
  }, [pollId])
}