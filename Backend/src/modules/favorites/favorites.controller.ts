import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Favoritos')
@Auth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar los productos favoritos del usuario autenticado',
  })
  findAll(@CurrentUser() currentUser: JwtPayload) {
    return this.favoritesService.findAllByUser(currentUser.sub);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Agregar un producto a favoritos' })
  add(
    @CurrentUser() currentUser: JwtPayload,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.favoritesService.add(currentUser.sub, productId);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Quitar un producto de favoritos' })
  remove(
    @CurrentUser() currentUser: JwtPayload,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.favoritesService.remove(currentUser.sub, productId);
  }
}
