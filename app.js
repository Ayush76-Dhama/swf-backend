// INSERT_YOUR_REWRITE_HEREconst cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  