import { DynamicModule, Global, Module, OnModuleDestroy, Optional } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { REDIS_CLIENT_TOKEN, REDIS_PUB_CONFIG_TOKEN, REDIS_PUB_SUB_TOKEN, REDIS_SUB_CONFIG_TOKEN } from './constants';
import { InjectRedisClient, InjectRedisPubSub } from './helpers';

export { Redis, RedisPubSub };

export interface IOModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any[]) => Promise<Redis.RedisOptions> | Redis.RedisOptions;
    inject?: any[];
}

@Global()
@Module({})
export class IOCoreModule implements OnModuleDestroy {
    constructor(
        @Optional()
        @InjectRedisClient()
        private readonly redisClient: Redis.Redis,

        @Optional()
        @InjectRedisPubSub()
        private readonly redisPubSub: RedisPubSub
    ) {}

    async onModuleDestroy() {
        if (this.redisClient) {
            this.redisClient.disconnect();
        }
        if (this.redisPubSub) {
            this.redisPubSub.getPublisher().disconnect();
            this.redisPubSub.getSubscriber().disconnect();
        }
    }

    static registerRedis(options: IOModuleAsyncOptions): DynamicModule {
        const configToken = 'redisClientConfigToken';
        const configProvider = {
            provide: configToken,
            ...options
        };
        const redisProvider = {
            provide: REDIS_CLIENT_TOKEN,
            useFactory: (config: Redis.RedisOptions) => {
                return new Redis(config);
            },
            inject: [configToken]
        };
        const providers = [configProvider, redisProvider];
        return {
            module: IOCoreModule,
            providers,
            exports: providers
        };
    }

    static registerRedisPubSub(
        publisherOpts: IOModuleAsyncOptions,
        subscriberOpts: IOModuleAsyncOptions
    ): DynamicModule {
        const pubConfigProvider = {
            provide: REDIS_PUB_CONFIG_TOKEN,
            ...publisherOpts
        };
        const subConfigProvider = {
            provide: REDIS_SUB_CONFIG_TOKEN,
            ...subscriberOpts
        };
        const redisPubSubProvider = {
            provide: REDIS_PUB_SUB_TOKEN,
            useFactory: (pubOpts: Redis.RedisOptions, subOtps: Redis.RedisOptions) => {
                return new RedisPubSub({
                    publisher: new Redis(pubOpts),
                    subscriber: new Redis(subOtps)
                });
            },
            inject: [REDIS_PUB_CONFIG_TOKEN, REDIS_SUB_CONFIG_TOKEN]
        };
        const providers = [pubConfigProvider, subConfigProvider, redisPubSubProvider];
        return {
            module: IOCoreModule,
            providers,
            exports: providers
        };
    }
}
