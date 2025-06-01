import type { ModuleMetadata } from '@nestjs/common/interfaces';

export type TlsType = { ca?: Buffer; key?: Buffer; cert?: Buffer };

export type RedisConnectionOptions = { nodes: string };
export type RedisAuthOptions = { username: string; password: string };
export type RedisCustomOptions = { tlsEnabled?: boolean; ca?: string; key?: string; cert?: string };
interface NodeConfiguration {
  host?: string | undefined;
  port?: number | undefined;
}
export type RedisModuleOptions = RedisConnectionOptions & RedisCustomOptions & RedisAuthOptions;

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | ((RedisModuleOptions | NodeConfiguration[] | Promise<RedisModuleOptions> | Promise<NodeConfiguration[]>) &
        RedisCustomOptions)
    | Promise<RedisCustomOptions>;
  inject?: any[];
}
