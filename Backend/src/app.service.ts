import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'ok',
      message: 'Gestión de Productos API',
      docs: '/api/docs',
    };
  }
}
