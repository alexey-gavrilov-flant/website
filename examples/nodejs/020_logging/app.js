const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const pino = require('pino');
const pinoHttp = require('pino-http');

const indexRouter = require('./routes/index');
const pingRouter = require('./routes/ping');

const app = express();

app.use(
  pinoHttp({
    logger: pino({ level: process.env.LOG_LEVEL || 'info' }),
    useLevel: 'info',
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/ping', pingRouter);

// [<en>] Error handler helps to avoid raw stack traces on logs and to use the logger of choise.
// [<ru>] Обработчик ошибок поможет избежать «сырых» трейсов в логе и использовать выбранный логгер.
app.use((err, req, res, next) => {
  req.log.error(err);
  res.status(500).send({ body: err.message });
});

module.exports = app;
