import { Body, Controller, Get, HttpCode, HttpStatus, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Auth } from '../auth/decorators/auth.decorator';

@ApiTags('Perfil')
@Auth()
@Controller('users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener el perfil del usuario autenticado',
  })
  @ApiOkResponse({ type: UserResponseDto })
  async getProfile(@CurrentUser() currentUser: JwtPayload) {
    const user = await this.usersService.findById(currentUser.sub);
    return this.usersService.toResponse(user);
  }

  @Patch('password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cambiar la contraseña del usuario autenticado',
  })
  @ApiOkResponse({
    schema: { example: { message: 'Contraseña actualizada correctamente' } },
  })
  async changePassword(
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(
      currentUser.sub,
      dto.currentPassword,
      dto.newPassword,
    );
    return { message: 'Contraseña actualizada correctamente' };
  }
}
