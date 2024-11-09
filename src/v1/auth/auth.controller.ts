import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JWT, MAIL, PASSWORD, RES } from 'utils';
import { UserService } from '../user/user.service';
import { ClientAuthGuard } from 'src/common/guard/clientAuth.guard';
import { AdminAuthGuard } from 'src/common/guard/adminAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }



  @Post('client-login')
  async loginClient(@Body() loginDto: LoginDto) {

    try {

      const { email, password } = loginDto

      const findUser = await this.userService.findUserByEmail(email)

      if (!findUser || findUser.role !== 1) {
        return RES.error(403, "Wrong email or password", "emailหรือรหัสผ่านไม่ถูกต้อง")
      }

      const comparePassword = await PASSWORD.compare(password, findUser.password)

      if (!comparePassword) {
        return RES.error(403, "Wrong email or password", "emailหรือรหัสผ่านไม่ถูกต้อง")
      }

      const getJwt = await JWT.access.create({ id: findUser.id, email: findUser.email, name: findUser.name })

      if (!getJwt) {
        return RES.error(400, "Error to login", "เข้าสู่ระบบผิดพลาด")
      }

      return RES.ok(200, "Success login", "เข้าสู่ระบบสำเร็จ", { token: getJwt })

    } catch (error) {
      console.log('Error at login')
      console.log(error)
      return RES.error(500, "System error", "เกิดข้อผิดพลาดจาก server")
    }

  }


  @Post('admin-login')
  async loginAdmin(@Body() loginDto: LoginDto) {

    try {

      const { email, password } = loginDto

      const findUser = await this.userService.findUserByEmail(email)

      if (!findUser || findUser.role !== 0) {
        return RES.error(403, "Wrong email or password", "emailหรือรหัสผ่านไม่ถูกต้อง")
      }

      const comparePassword = await PASSWORD.compare(password, findUser.password)

      if (!comparePassword) {
        return RES.error(403, "Wrong email or password", "emailหรือรหัสผ่านไม่ถูกต้อง")
      }

      const getJwt = await JWT.access.create({ id: findUser.id, email: findUser.email, name: findUser.name })

      if (!getJwt) {
        return RES.error(400, "Error to login", "เข้าสู่ระบบผิดพลาด")
      }

      return RES.ok(200, "Success login", "เข้าสู่ระบบสำเร็จ", { token: getJwt })

    } catch (error) {
      console.log('Error at login')
      console.log(error)
      return RES.error(500, "System error", "เกิดข้อผิดพลาดจาก server")
    }

  }

  @Get('validate-client')
  @UseGuards(ClientAuthGuard)
  async validateClient(@Req() request) {
    try {
      if (!request.user) {
        return RES.error(403, "Error to validate user", "ยืนยันตัวตนไม่สำเร็จ")
      }
      const res = { ...request.user, password: undefined }
      return RES.ok(200, "Success to validate", "ยืนยันตัวตนสำเร็จ", res)
    } catch (error) {
      console.log('error at validate client')
      console.log(error)
      return RES.error(500, "System error", "เกิดข้อผิดพลาดจากระบบ")
    }

  }

  @Get('validate-admin')
  @UseGuards(AdminAuthGuard)
  async validateAdmin(@Req() request) {
    try {
      if (!request.user) {
        return RES.error(403, "Error to validate user", "ยืนยันตัวตนไม่สำเร็จ")
      }
      const res = { ...request.user, password: undefined }
      return RES.ok(200, "Success to validate", "ยืนยันตัวตนสำเร็จ", res)
    } catch (error) {
      console.log('error at validate client')
      console.log(error)
      return RES.error(500, "System error", "เกิดข้อผิดพลาดจากระบบ")
    }

  }

}
