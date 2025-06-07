const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3015;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
    exec(`start http://localhost:${PORT}`);
});