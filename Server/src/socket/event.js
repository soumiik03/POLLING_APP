export function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Join a poll room
    socket.on('join_poll', (pollId) => {
      socket.join(pollId)
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })
}