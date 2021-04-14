import { Inject } from '@nestjs/common';

import { REDIS_CLIENT_TOKEN, REDIS_PUB_SUB_TOKEN } from './constants';

// eslint-disable-next-line @typescript-eslint/ban-types
export function InjectRedisClient(): (target: object, key: string | symbol, index?: number) => void {
    return Inject(REDIS_CLIENT_TOKEN);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function InjectRedisPubSub(): (target: object, key: string | symbol, index?: number) => void {
    return Inject(REDIS_PUB_SUB_TOKEN);
}
