import * as convict from 'convict';

export const config = convict({
    env: {
        doc: 'The application environment.',
        format: ['development', 'staging', 'production'],
        default: 'development',
        env: 'PROJECT_ENV',
    },
    port: {
        doc: 'The port to bind.',
        format: Number,
        default: 3000,
        env: 'PORT',
        arg: 'port',
    },
    host: {
        doc: 'Application host.',
        format: String,
        default: 'localhost',
        env: 'HOST',
    },
    db: {
        host: {
            doc: 'Database host name/IP',
            format: '*',
            default: 'mongodb://127.0.0.1:27017',
            env: 'DB_MONGO_HOST',
        },
        name: {
            doc: 'Database name',
            format: String,
            default: '',
            env: 'DB_MONGO_NAME',
        },
    },
    baseUrl: {
        doc: 'API base url.',
        format: String,
        default: '',
        env: 'BASE_URL',
        arg: 'base-url',
    },
    basePath: {
        doc: 'API base path.',
        format: String,
        default: '',
    },
    jwt: {
        secret: {
            doc: 'JWT Secret',
            format: String,
            default: 'secret-string'
        },
        expiration: {
            doc: 'JWT Token expiration',
            format: String,
            default: '5m',
            env: 'JWT_EXPIRATION'
        }
    },
    mailToken : {
        doc: 'Mailtrap token',
        format: String,
        default: '',
    }
});

const env = config.get('env');
config.loadFile('./src/envs/' + env + '.json');

config.validate({ allowed: 'strict' });