import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { serviceName } from '../../shared/constants/service-name.const';
import { ScopeLogger } from './scope-logger';

export enum LogLevel {
  ERROR = 'error',
  WARNING = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger {
  public readonly service: string;

  public constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly winston: any) {
    super();
    this.service = serviceName;
  }

  public log(message: any, context?: string, correlationId?: string): any {
    this.winston.log(LogLevel.INFO, this.buildLogObject(message, context, correlationId));
  }

  public error(message: any, trace?: string, context?: string, correlationId?: string): any {
    this.winston.log(LogLevel.ERROR, this.buildLogObject(message, context, correlationId, trace));
  }

  public warn(message: any, context?: string, correlationId?: string): any {
    this.winston.log(LogLevel.WARNING, this.buildLogObject(message, context, correlationId));
  }

  public debug(message: any, context?: string, correlationId?: string): any {
    this.winston.log(LogLevel.DEBUG, this.buildLogObject(message, context, correlationId));
  }

  public verbose(message: any, context?: string, correlationId?: string): any {
    this.winston.log(LogLevel.VERBOSE, this.buildLogObject(message, context, correlationId));
  }

  public toScopeLogger(correlationId: string = null): ScopeLogger {
    return new ScopeLogger(this, correlationId);
  }

  private buildLogObject(message: any, context?: string, correlationId?: string, trace?: string): LogObject {
    const module = context || this.context;

    let data: LogObject = {
      service: this.service,
      trace,
      module: module?.replace('Controller', ''),
      correlationId: correlationId ? correlationId : '',
    };

    if (message instanceof Object) {
      data = { ...data, ...message };
    } else {
      data.message = message;
    }

    return data;
  }
}
