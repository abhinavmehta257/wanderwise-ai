
const express = require('express');
const app = express();
const chatRoutes = require('./routes/chat');

// ...existing code...

app.use(express.json());
app.use('/api/chat', chatRoutes);

// ...existing code...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});