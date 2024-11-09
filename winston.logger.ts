import * as winston from "winston" // Au lieu de import winston from "winston"
import * as fs from 'fs'
import * as moment from 'moment';
import { isEmpty } from 'lodash';
import { config } from './convict.config';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const { format } = winston
const { combine, timestamp, printf, metadata, colorize, errors } = format

const dir = './logs'
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
}

const customFormat = (): winston.Logform.Format => {
    return combine(
        errors({ stack: true }),
        metadata({}),
        timestamp(),
        colorize({ all: true }),
        printf(({ level, message, time, meta }) => {
            let out = `[${moment(time).format('DD/MM/YYYY:HH:mm:ss ZZ')}] [${level}] ${message}\n`

            if (meta && meta.error) {
                out += `\n${meta.methodPath}\n\n`
                out += `\n${meta.stack}\n\n`
                out += meta.query ?? '\n'
            } else if (!isEmpty(meta)) {
                out += `\n${JSON.stringify(meta, [], 2)}\n`
            }

            return out;
        })
    )
}

const loggerObj: winston.Logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {},
    exitOnError: false,
    handleExceptions: true,
    transports: [
        new winston.transports.File({
            level: 'error',
            filename: `${process.cwd()}/logs/error.log`,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            handleExceptions: true,
            format: customFormat()
        }),
        new winston.transports.File({
            filename: `${process.cwd()}/logs/combined.log`,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            format: customFormat()
        })
    ]
})

loggerObj.add(new winston.transports.Console({
    level: 'silly',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike(`Crowdfunding API - ${config.get('env')}`, {
            colors: true,
            prettyPrint: true,
        }),
    ),
    handleExceptions: true
}))

export const winstonLoggerConfig = loggerObj;

export const morganOptions = {
    stream: {
        write: (message: string) => {
            if (config.get('env') === 'test') { return }
            loggerObj.info(message.trim());
        },
    },
};