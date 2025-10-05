import winston from "winston";

const MODE = process.env.MODE;

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: MODE==="prod"?"error":"info",
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: "warn",
            filename: "./src/logs/error.log",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

export const requestLogger = (req, res, next) => {
    req.logger = logger;
    next();
};


