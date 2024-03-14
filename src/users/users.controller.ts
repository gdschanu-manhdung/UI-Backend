import {
    Controller,
    HttpStatus,
    Inject,
    Post,
    Put,
    Req,
    Res
} from '@nestjs/common'
import { ApiBody } from '@nestjs/swagger'
import { Request, Response } from 'express'
import { Routes, Services } from 'src/utils/constants'
import { UserDetails } from 'src/utils/types'
import { ChangePasswordDto } from './dto/ChangePassword.dto'
import { RecoveryPasswordDto } from './dto/RecoveryPassword.dto'
import { RegisterDto } from './dto/Register.dto'
import { UpdateUserDto } from './dto/UpdateUser.dto'
import { UsersService } from './users.service'

@Controller(Routes.USERS)
export class UsersController {
    constructor(@Inject(Services.USERS) private usersService: UsersService) {}

    @ApiBody({ type: RegisterDto })
    @Post('register')
    async register(@Req() req: Request, @Res() res: Response) {
        const registerDto = req.body as RegisterDto

        return res.status(HttpStatus.OK).json({
            user: await this.usersService.createUser(registerDto)
        })
    }

    @ApiBody({ type: UpdateUserDto })
    @Put('updateUser')
    async updateUser(@Req() req: Request, @Res() res: Response) {
        const userDetails = req.body as UserDetails

        return res.status(HttpStatus.OK).json({
            user: await this.usersService.updateUser(userDetails)
        })
    }

    @ApiBody({ type: ChangePasswordDto })
    @Put('changePassword')
    async changePassword(@Req() req: Request, @Res() res: Response) {
        const changePasswordDto = req.body as ChangePasswordDto

        return res.status(HttpStatus.OK).json({
            user: await this.usersService.changePassword(changePasswordDto)
        })
    }

    @ApiBody({ type: RecoveryPasswordDto })
    @Post('recoveryPassword')
    async recoveryPassword(@Req() req: Request, @Res() res: Response) {
        const recoveryPasswordDto = req.body as RecoveryPasswordDto

        return res.status(HttpStatus.OK).json({
            user: await this.usersService.recoveryPassword(recoveryPasswordDto)
        })
    }
}
