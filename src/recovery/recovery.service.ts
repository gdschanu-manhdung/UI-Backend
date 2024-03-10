import { Inject, HttpException, HttpStatus } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { Services } from 'src/utils/constants'
import { UserDetails } from 'src/utils/types'
import { IRecoveryService } from './recovery'
import { MailerService } from '@nestjs-modules/mailer'
import { randomRecoveryCode } from 'src/utils/helper'
import { InjectRepository } from '@nestjs/typeorm'
import { Recovery } from 'src/database/typeorm/entities/Recovery'
import { Repository } from 'typeorm'

export class RecoveryService implements IRecoveryService {
    constructor(
        @Inject(Services.USERS) private usersService: UsersService,
        private readonly mailerService: MailerService,
        @InjectRepository(Recovery)
        private readonly recoveryRepository: Repository<Recovery>
    ) {}

    async sendRecoveryMail(userDetails: UserDetails) {
        try {
            const user = await this.usersService.findUserByEmail(userDetails)

            if (!user) {
                throw new HttpException('Wrong Email', HttpStatus.UNAUTHORIZED)
            }

            const recoveryCode = randomRecoveryCode()

            await this.mailerService.sendMail({
                to: userDetails.email,
                from: 'no-reply@example.com',
                subject: 'Recovery Code for ITKid Account',
                text: `This is your recovery code: ${recoveryCode}. Please don\'t share it to anyone!. Recovery code is only valid for 20 minutes.`,
                html: `<div>This is your recovery code: <b>${recoveryCode}</b>.</div><div> Please don\'t share it to anyone!</div><div>Recovery code is only valid for 20 minutes.</div>`
            })

            const existingRecovery = await this.recoveryRepository.findOne({
                where: { user }
            })

            if (!existingRecovery) {
                const recovery = this.recoveryRepository.create({
                    user,
                    recoveryCode,
                    generatedTime: new Date().toISOString()
                })

                await this.recoveryRepository.save(recovery)
            } else {
                const recovery = {
                    ...existingRecovery,
                    recoveryCode,
                    generatedTime: new Date().toISOString()
                }
                await this.recoveryRepository.save(recovery)
            }

            return 'Recovery code is sent!'
        } catch (error) {
            console.error(error)
        }
    }
}
