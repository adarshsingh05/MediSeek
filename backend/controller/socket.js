const { Server } = require('socket.io');
const Message = require('../models/Message'); // Import the Message model
const initSocket = (server) => {
    const io = new Server(server, {
        cors: { origin: '*' },
    });

    io.on('connection', (socket) => {
        console.log('🔵 User connected:', socket.id);

        socket.on('joinRoom', ({ senderId, receiverId }) => {
            const room = [senderId, receiverId].sort().join('_');
            socket.join(room);
        });

        socket.on('sendMessage', async (data) => {
            const { senderId, receiverId, messageText } = data;

            const message = new Message({ senderId, receiverId, messageText });
            await message.save();

            const room = [senderId, receiverId].sort().join('_');
            io.to(room).emit('receiveMessage', message);
        });

        socket.on('disconnect', () => {
            console.log('🔴 User disconnected:', socket.id);
        });
    });
};

module.exports = initSocket;
