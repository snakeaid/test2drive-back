import * as fs from 'fs';

import type { Provider } from '@nestjs/common';
import type { Cluster as ClusterType, Redis as RedisType, RedisOptions } from 'ioredis';

import { RedisModuleAsyncOptions, RedisModuleOptions } from '../redis.types';
import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from '../redis.constants';

import { getClusterClient } from './cluster.strategy';
import { getStandaloneClient } from './standalone.strategy';

import { redisConsole } from '../utils';

export type RedisClientType = RedisType | ClusterType;

export interface RedisClient {
  client: RedisClientType;
}

export async function redisClientFactory(options: RedisModuleOptions): Promise<RedisClient> {
  if (typeof options !== 'object' || !Object.keys(options).length) {
    throw new Error('Have no provided Redis options');
  }

  if (!options.nodes || !options.nodes.length) {
    throw new Error('Have no provided Redis nodes');
  }

  let tls = null;

  if (options.tlsEnabled) {
    if ((!options.cert && !options.key) || !options.ca) {
      throw new Error('Have no provided Redis client certificates');
    }

    tls = {
      ca: fs.readFileSync(options.ca),
      key: fs.readFileSync(options.key),
      cert: fs.readFileSync(options.cert),
    };
  }

  const auth = { password: options.password || null, username: options.username || null };

  const connections = options.nodes.split(',').map((instance) => {
    const [host, port] = instance.split(':');

    return { host, port } as unknown as RedisOptions;
  }) as RedisOptions[];

  const client =
    connections.length > 1
      ? await getClusterClient(connections, { tls, auth })
      : await getStandaloneClient(connections[0], { tls, auth });

  client.on('connect', () => redisConsole('Connected'));
  client.on('ready', () => redisConsole('Ready'));
  client.on('error', (err: string) => {
    redisConsole('Error: ', err);
  });

  return {
    client,
  };
}

export const createClient = (): Provider => ({
  provide: REDIS_CLIENT,
  useFactory: redisClientFactory,
  inject: [REDIS_MODULE_OPTIONS],
});

export const createClientOptions = (options: RedisModuleOptions): any => ({
  useValue: options,
  provide: REDIS_MODULE_OPTIONS,
});

export const createAsyncClientOptions = (options: RedisModuleAsyncOptions): any => ({
  provide: REDIS_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject,
});

export class RedisClientError extends Error {}
