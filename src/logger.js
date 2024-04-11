import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const customWinstonLevels = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'magenta',
        fatal: 'red'
    }
};

winston.addColors(customWinstonLevels.colors);

const createLogger = (env) => {
    const logTransports = [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ];

    if (env === 'PROD') {
        logTransports.push(
            new winston.transports.Console({
                filename: 'server.log',
                level: 'info',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }),
            new winston.transports.File({
                filename: 'errors.log',
                level: 'error',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json()
                )
            })
        );
    }

    return winston.createLogger({
        levels: customWinstonLevels.levels,
        transports: logTransports
    });
};

const logger = createLogger(process.env.ENVIRONMENT);

export default logger;
