const express = require('express');
const path = require('path');
const open = require('open').default;
const chalk = require('chalk').default;
const app = express();
const PORT = process.env.PORT || 3000;
const DEV_TUNNEL_URL = 'devtunnels link';
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, async () => {
   const runningLocal = process.env.PORT ? false : true;
   const urlToOpen = runningLocal ? `http://localhost:${PORT}` : DEV_TUNNEL_URL;
    console.log(chalk.green.bold(`Server is running at ${urlToOpen}`));
    console.log(chalk.blue(runningLocal ? 'Localhost Started' : 'DevTunnel Started'));
    await open(urlToOpen);
});
