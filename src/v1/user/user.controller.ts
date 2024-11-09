import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto, ChangePasswordDto, CreateUserDto, RequestChangePasswordDto, UserRegisterDto, ValidateChangePasswordTokenDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JWT, MAIL, PASSWORD, RES } from 'utils';
import { AdminAuthGuard } from 'src/common/guard/adminAuth.guard';
import { PassThrough } from 'stream';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,) { }


  @Post('request-change-password')
  async changePassword(@Body() requestChangePasswordDto: RequestChangePasswordDto) {
    try {
      const { email } = requestChangePasswordDto
      const token = await JWT.mail.changePassword(email)
      if (!token) {
        return RES.error(403, "Error request change password", "ขอเปลี่ยนรหัสผ่านไม่สำเร็จ")
      }
      const sendMail = await MAIL.sendChangePassword(email, token)
      if (!sendMail) {
        return RES.error(400, "Error to sent email", "ส่ง email ไม่สำเร็จ")
      }
      return RES.ok(200, "Success to sent email", "ส่ง email สำเร็จ", { sendMail })
    } catch (error) {
      return RES.error(500, "internal error", "เกิดข้อผิดพลาดจาก server")
    }
  }

  @Post('validate-change-password')
  async validateChangePassword(@Body() validateChangePasswordTokenDto: ValidateChangePasswordTokenDto) {
    try {

      const { token } = validateChangePasswordTokenDto

      const exposeData = await JWT.mail.expose(token)

      if (!exposeData) {
        return RES.error(400, "Error to validate Link", "Link ไม่ถูกต้องหรือหมดอายุ")
      }

      const { email } = exposeData

      const findUser = await this.userService.findUserByEmail(email)

      if (findUser) {
        return RES.ok(200, "Success validate", "ยืนยัน token สำเร็จ", { email: findUser.email })
      }
      else {
        return RES.error(400, "Error validate", "ยืนยัน token ไม่สำเร็จ")
      }
    } catch (error) {
      return RES.error(500, "internal error", "เกิดข้อผิดพลาดจาก server")

    }
  }

  @Post('change-password')
  async ChangePassword(@Body() changePasswordDto: ChangePasswordDto) {
    try {

      const { token, password } = changePasswordDto

      const exposeData = await JWT.mail.expose(token)

      const { email } = exposeData

      const findUser = await this.userService.findUserByEmail(email)

      if (!findUser) {
        return RES.error(400, "Error validate", "ยืนยัน token ไม่สำเร็จ")
      }

      const hashPassword = await PASSWORD.hash(password)

      if (!hashPassword) {
        return RES.error(400, "Error to create password", "สร้างรหัสผ่านไม่สำเร็จ")
      }

      const updatePassword = await this.userService.updatePassword(findUser.id, hashPassword)

      if (updatePassword) {
        return RES.ok(200, "Success to update password", "เปลี่ยนรหัสผ่านสำเร็จ", {})
      }
      else {
        return RES.error(400, "Error to update password", "เปลี่ยนรหัสผ่านไม่สำเร็จ")
      }


    } catch (error) {
      RES.error(500, "internal error", "เกิดข้อผิดพลาดจาก server")
    }
  }

  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto) {

    try {

      const { name, email, password } = userRegisterDto

      const findEmail = await this.userService.findUserByEmail(email)

      if (findEmail) {
        return RES.error(400, "This email is current using", "email นี้ถูกใช้งานแล้ว")
      }

      const hashPassword = await PASSWORD.hash(password)

      if (!hashPassword) {
        return RES.error(400, "Error to create password", "สร้างรหัสผ่านไม่สำเร็จ")
      }

      const createClient = await this.userService.createClient(name, email, hashPassword)

      if (createClient) {
        return RES.ok(200, "Success create new user", "สร้างผู้ใช้งานสำเร็จ", {})
      }
      else {
        return RES.error(400, "Error to create new user", "สร้างผู้ใช้งานใหม่ไม่สำเร็จ")
      }

    } catch (error) {
      console.log(error)
      return RES.error(500, "System error", "เกิดข้อผิดพลาดจากระบบ")
    }

  }


  @Get('admin-findall')
  @UseGuards(AdminAuthGuard)
  async adminFindAll() {
    try {
      const getUser = await this.userService.adminFindAll();
      if (getUser) {
        return RES.ok(200, "Success find user", "ค้นหาผู้ใช้งานสำเร็จ", getUser)
      }
      else {
        return RES.error(400, "Error to find user", "ค้นหาผู้ใช้งานไม่สำเร็จ")
      }
    } catch (error) {
      console.log(error)
      return RES.error(500, "System error", "เกิดข้อผิดพลาดจากระบบ")
    }

  }

  @Get('admin-findone/:id')
  @UseGuards(AdminAuthGuard)
  async adminFindOne(@Param('id') id: string) {
    try {
      const getUser = await this.userService.adminFindOne(+id);
      if (getUser) {
        return RES.ok(200, "Success find user", "ค้นหาผู้ใช้งานสำเร็จ", getUser)
      }
      else {
        return RES.error(400, "Error to find user", "ค้นหาผู้ใช้งานไม่สำเร็จ")
      }
    } catch (error) {
      console.log(error)
      return RES.error(500, "System error", "เกิดข้อผิดพลาดจากระบบ")
    }
  }

  @Patch('admin-update/:id')
  @UseGuards(AdminAuthGuard)
  async adminUpdate(@Param('id') id: string, @Body() adminUpdateDto: UserUpdateDto) {
    try {

      const { name, email, password } = adminUpdateDto

      const findAdmin = await this.userService.adminFindOne(+id)
      if (!findAdmin) {
        return RES.error(400, "Error to find user", "ค้นหาผู้ใช้งานไม่สำเร็จ")
      }

      const findEmail = await this.userService.findUserByEmail(email)

      if (findEmail && findEmail.id !== +id) {
        return RES.error(400, "Error email is using", "email นี้ถูกใช้งานแล้ว")
      }
      let data: any = {
        email,
        name,
      }
      if (password) {
        const hashPassword = await PASSWORD.hash(password)

        if (!hashPassword) {
          return RES.error(400, "Error hash password", "เข้ารหัสรหัสผ่านผิดพลาด")
        }
        data = {
          ...data,
          password: hashPassword
        }
      }

      const updateData = await this.userService.update(+id, data)

      if (!updateData) {
        return RES.error(400, "Error update user", "update ข้อมูลไม่สำเร็จ")
      }

      return RES.ok(200, "Success update user", "update ข้อมูลสำเร็จ", updateData)

    } catch (error) {
      console.log(error)
      return RES.error(500, "System error", "เกิดข้อผิดพลาดจากระบบ")
    }
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
