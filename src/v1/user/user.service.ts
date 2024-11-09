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

      const findUser = await this.db.users.findUnique({
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

  async createClient(name: string, email: string, password: string) {

    try {

      const create = await this.db.users.create({
        data: {
          email: email,
          name: name,
          password: password,
        }
      })

      return create

    } catch (error) {
      console.log(error)
      return null
    }

  }

  async updateCredit(id: number, credit: number, transaction: Prisma.TransactionClient | null | undefined) {

    const dbt = transaction ? transaction : this.db

    const update = await dbt.users.update({
      where: {
        id
      },
      data: {
        credit
      }
    })

    return update

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

      const findUser = await this.db.users.findMany({
        where: {
          role: 0,
        },
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
        where: {
          role: 1,
        },
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
        select: {
          name: true
        }
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
          role: 0,
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
