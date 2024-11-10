import { Injectable } from '@nestjs/common';
import { CreateUserDto, UserUpdateDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(private readonly db: PrismaService) { }

  async findUserByEmail(email: string) {

    try {

      const findUser = await this.db.users.findFirst({
        where: {
          email,
          isActive: true
        }
      })

      return findUser

    } catch (error) {
      console.log("error at find user from database")
      console.log(error)
      return null
    }

  }

  async findAdminByEmail(email: string) {

    try {

      const findUser = await this.db.admin.findFirst({
        where: {
          email,
          isActive: true
        }
      })

      return findUser

    } catch (error) {
      console.log("error at find user from database")
      console.log(error)
      return null
    }

  }

  async updatePassword(id: number, password: string) {
    try {
      const update = await this.db.users.update({
        where: {
          id: id,
          isActive: true
        },
        data: {
          password: password
        }
      })
      return update
    } catch (error) {
      console.log("error at update password")
      console.log(error)
      return null
    }
  }

  async createAdmin(email: string, password: string) {

    try {

      const create = await this.db.admin.create({
        data: {
          email: email,
          password: password,
        }
      })

      return create

    } catch (error) {
      console.log(error)
      return null
    }

  }

  async createClient(email: string, password: string) {

    try {

      const create = await this.db.users.create({
        data: {
          email: email,
          password: password,
        }
      })

      return create

    } catch (error) {
      console.log(error)
      return null
    }

  }


  async findOne(id: number) {
    try {

      const findUser = await this.db.users.findFirst({
        where: {
          id,
          isActive: true
        },
        omit: {
          password: true
        }
      })

      return { ...findUser, password: undefined }

    } catch (error) {
      console.log("error at find user from database")
      console.log(error)
      return null
    }
  }

  async adminFindAll() {
    try {

      const findUser = await this.db.admin.findMany({
        omit: {
          password: true
        }
      })

      return findUser

    } catch (error) {
      console.log("error at find user from database")
      console.log(error)
      return null
    }
  }

  async clientFindAll() {
    try {

      const findUser = await this.db.users.findMany({
        omit: {
          password: true
        }
      })

      return findUser

    } catch (error) {
      console.log("error at find user from database")
      console.log(error)
      return null
    }
  }

  async getAllName() {
    try {

      const findUser = await this.db.users.findMany({

      })

      return findUser

    } catch (error) {
      console.log("error at find user from database")
      console.log(error)
      return null
    }
  }


  async adminFindOne(id: number) {
    try {

      const findUser = await this.db.users.findFirst({
        where: {
          id,
        },
        omit: {
          password: true
        }
      })
      return { ...findUser, password: undefined }

    } catch (error) {
      console.log("error at find user from database")
      console.log(error)
      return null
    }
  }





  async update(id: number, updateUserDto: UserUpdateDto) {
    try {

      const create = await this.db.users.update({
        where: {
          id
        },
        data: {
          ...updateUserDto
        }
      })

      return create

    } catch (error) {
      console.log(error)
      return null
    }
  }

}
