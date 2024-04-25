require("express-async-errors");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require('./config/config');
const { globalErrorHandler } = require('./middlewares/errorHandlerMiddleware');
const ErrorSchema = require('./schemes/ErrorSchema');

app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));
app.use(bodyParser.json({ limit: "500mb" }));

/* WEB APIs Request Layer */
app.use('/', require("./routes_usages"));

// handle APIs not found 
app.all('*', (req, res, next) => {
    next(new ErrorSchema(404, `Can not find ${req.originalUrl}`));
});

// global error handling middleware
app.use(globalErrorHandler);

app.listen(config.port_no, () => {
    console.log(`App listening on PORT ${config.port_no}`);
});