import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(query: QueryProductDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const qb = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (query.search) {
      qb.andWhere('(product.name ILIKE :search OR product.description ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    if (query.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    await this.categoriesService.findOne(dto.categoryId);
    await this.assertNameNotTaken(dto.name);

    const product = this.productsRepository.create({
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      stock: dto.stock,
      categoryId: dto.categoryId,
      images: (dto.images ?? []).map((url, index) =>
        this.productImagesRepository.create({ url, order: index }),
      ),
    });

    const saved = await this.productsRepository.save(product);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.categoryId && dto.categoryId !== product.categoryId) {
      await this.categoriesService.findOne(dto.categoryId);
    }

    if (dto.name && dto.name.toLowerCase() !== product.name.toLowerCase()) {
      await this.assertNameNotTaken(dto.name);
    }

    const { images, ...rest } = dto;
    Object.assign(product, rest);

    if (images) {
      await this.productImagesRepository.delete({ productId: id });
      product.images = images.map((url, index) =>
        this.productImagesRepository.create({ url, order: index }),
      );
    }

    await this.productsRepository.save(product);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  private async assertNameNotTaken(name: string): Promise<void> {
    const existing = await this.productsRepository.findOne({
      where: { name: ILike(name) },
    });
    if (existing) {
      throw new ConflictException('Ya existe un producto con este nombre');
    }
  }
}
