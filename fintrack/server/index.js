const path = require('path');
const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', require('./routes/profiles'));
app.use('/api', require('./routes/import'));
app.use('/api', require('./routes/transactions'));
app.use('/api', require('./routes/categories'));
app.use('/api', require('./routes/rules'));
app.use('/api', require('./routes/balance'));
app.use('/api', require('./routes/reports'));

const webDist = path.join(__dirname, '..', 'web', 'dist');
app.use(express.static(webDist));
app.get('*', (req, res) => {
  res.sendFile(path.join(webDist, 'index.html'));
});

const PORT = process.env.PORT || 8099;
const server = app.listen(PORT, () => {
  console.log(`FinTrack server listening on port ${PORT}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down...`);
  server.close(() => {
    db.pragma('wal_checkpoint(TRUNCATE)');
    db.close();
    process.exit(0);
  });
  // Force-exit if requests/connections don't drain in time
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
