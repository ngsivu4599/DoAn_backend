import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { API_FAIL, PLACE_MESSAGE, ROLE } from '../../common/constant';
import { OwnerApartment } from '../owner-apartment/entities/owner-apartments.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { GetPlaceParams } from './dto/get-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { Apartment } from './entities/apartment.entity';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Apartment)
    private placeRepository: Repository<Apartment>,
    @InjectRepository(OwnerApartment)
    private ownerPlaceRepository: Repository<OwnerApartment>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createPlaceDto: CreatePlaceDto, user) {
    const { services, ...restCreatePlace } = createPlaceDto;
    const listServices = JSON.stringify(services);
    const owner = await this.ownerPlaceRepository.findOne({
      where: { id: user.relativeId },
    });

    const place = await this.placeRepository.create({
      owner,
      listServices,
      ...restCreatePlace,
    });
    await this.placeRepository.save(place);
    return place;
  }
  async createOrder() {
    // Kiểm tra tiền trong tk
    // Kiểm tra giờ đặt có trống
    // Gửi mail cho admin

    return 1;
  }

  async confirmOrder(token, orderId) {
    const payload = await this.jwtService.verify(token);
    if (payload.role !== ROLE.owner) {
      return API_FAIL;
    }
  }

  async findAll(getParams: GetPlaceParams) {
    const { minPrice, maxPrice, minArea, maxArea,province, district, ward  } = getParams;
    const places = await this.placeRepository.findAndCount({
      where: {
        isEnable: true
      },
      skip: (getParams.page - 1) * getParams.pageSize,
      take: getParams.pageSize,
      order: {
        createAt: 'DESC',
      },
    });
    const res = places[0];
    const records = res.filter(place => {
      if (minPrice && Number(place.price) < minPrice) {
        return false;
      }
      if (maxPrice && Number(place.price) > maxPrice) {
        return false;
      }
      if (minArea && Number(place.area) < minArea) {
        return false;
      }
      if (maxArea && Number(place.area) > maxArea) {
        return false;
      }
      if (province && place.province !== province) {
        return false;
      }
      if (district && place.district !== district) {
        return false;
      }
      if (ward && place.ward !== ward) {
        return false;
      }
      return true;
    });
    return {
      total: places[1],
      pageSize: getParams.pageSize,
      currentPage: getParams.page,
      records,
    };
  }

  async findOne(id: string) {
    const place = await this.placeRepository.findOne({
      where: {
        isEnable: true,
        id,
      },
    });
    place.listServices = JSON.parse(place.listServices);
    return place;
  }

  update(id: number, updatePlaceDto: UpdatePlaceDto) {
    return `This action updates a #${id} place`;
  }

  async remove(id: string, user) {
    const place = await this.placeRepository.findOne({
      where: { id: id },
      relations: ['owner'],
    });
    if (place.owner.id === user.relativeId) {
      await this.placeRepository.update(id, {
        isEnable: false,
      });
    }
    return PLACE_MESSAGE.DISABLE_SUCCESS;
  }
}
