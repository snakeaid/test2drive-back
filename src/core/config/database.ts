import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    console.log('🔧 Configuring database connection...');
    console.log('📍 Environment:', process.env.NODE_ENV);
    console.log('🔐 DB Host:', process.env.DB_HOST);
    console.log('🚪 DB Port:', process.env.DB_PORT);
    console.log('👤 DB User:', process.env.DB_USERNAME);
    console.log('📁 DB Name:', process.env.DB_NAME);
    console.log('🔒 SSL Mode:', isProduction ? 'enabled' : 'disabled');

    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'test2drive',
      entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
      synchronize: true, // Disable synchronize in production
      logging: !isProduction,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
      extra: isProduction ? {
        ssl: {
          rejectUnauthorized: false,
        },
      } : {},
    };
  },
); 