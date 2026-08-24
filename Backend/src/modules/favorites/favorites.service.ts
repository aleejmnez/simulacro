import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoritesRepository: Repository<Favorite>,
    private readonly productsService: ProductsService,
  ) {}

  async findAllByUser(userId: string) {
    const favorites = await this.favoritesRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return favorites.map((favorite) => favorite.product);
  }

  async add(userId: string, productId: string): Promise<Favorite> {
    await this.productsService.findOne(productId);

    const existing = await this.favoritesRepository.findOne({
      where: { userId, productId },
    });
    if (existing) {
      throw new ConflictException('El producto ya está en favoritos');
    }

    const favorite = this.favoritesRepository.create({ userId, productId });
    return this.favoritesRepository.save(favorite);
  }

  async remove(userId: string, productId: string): Promise<void> {
    const favorite = await this.favoritesRepository.findOne({
      where: { userId, productId },
    });
    if (!favorite) {
      throw new NotFoundException('Este producto no está en tus favoritos');
    }
    await this.favoritesRepository.remove(favorite);
  }
}
