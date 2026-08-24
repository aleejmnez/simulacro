import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Home')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Estado de la API',
    description: 'Endpoint de comprobación rápida de que la API está en línea.',
  })
  getHello() {
    return this.appService.getHello();
  }
}
