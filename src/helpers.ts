import { Inject } from '@nestjs/common';

import { REDIS_CLIENT_TOKEN, REDIS_PUB_SUB_TOKEN } from './constants';

export function InjectRedisClient(): (target: any, key: string | symbol, index?: number) => void {
    return Inject(REDIS_CLIENT_TOKEN);
}

export function InjectRedisPubSub(): (target: any, key: string | symbol, index?: number) => void {
    return Inject(REDIS_PUB_SUB_TOKEN);
}
