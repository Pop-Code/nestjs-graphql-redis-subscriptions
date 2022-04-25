import { DynamicModule, Global, Module } from '@nestjs/common';

import { IOCoreModule, IOModuleAsyncOptions } from './module.core';

@Global()
@Module({})
export class IOModule {
    static registerRedis(options: IOModuleAsyncOptions): DynamicModule {
        return {
            module: IOModule,
            imports: [IOCoreModule.registerRedis(options)]
        };
    }

    static registerRedisPubSub(pubOpts: IOModuleAsyncOptions, subOpts: IOModuleAsyncOptions): DynamicModule {
        return {
            module: IOModule,
            imports: [IOCoreModule.registerRedisPubSub(pubOpts, subOpts)]
        };
    }
}
