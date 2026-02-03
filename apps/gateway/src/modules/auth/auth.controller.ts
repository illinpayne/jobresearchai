import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Res } from '@nestjs/common';
import { AuthClientGrpc } from './auth.grpc'
import { ApiBearerAuth, ApiConflictResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { SendOtpRegisterResponse } from './responses/send-otp-register.response'
import { SendOtpRegisterDto } from './dtos/send-otp-register.dto'
import { LoginRequest, RegisterSendOtpRequest, RegisterVerifyOtpRequest } from '@jrai/contracts/gen/auth'
import { VerifyOTPRegister } from './dtos/verify-otp-register.dto'
import { AuthResponse } from './responses/auth.response'
import { LoginDto } from './dtos/login.dto'
import { CookieService } from '@/infrastructure/cookie-service/cookie-service.service'
import { LogoutResponse } from './responses/logout.response'
import { CookieType } from '@/common/enums/cookie.enum'
import type { Response } from 'express'


@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly client: AuthClientGrpc, private readonly cookieService: CookieService) {}

  @ApiOperation({
    summary: 'Register new account',
    description: 'Sends OTP code to the email for verify',
  })
  @ApiOkResponse({
    description: 'Returns status and message',
    type: SendOtpRegisterResponse,
  })
  @ApiConflictResponse({ description: 'Account already exist, Cannot create account' })
  @ApiInternalServerErrorResponse({ description: 'Failed to send OTP' })
  @Post('send-otp-register')
  @HttpCode(HttpStatus.OK)
  async sendRegisterOTP(@Body() dto: SendOtpRegisterDto) {
    return await this.client.call('sendRegisterOtp', dto as RegisterSendOtpRequest)
  }

  @ApiOperation({
    summary: 'Verify OTP code and log in',
    description: 'Verifies OTP code and log into account',
  })
  @ApiOkResponse({
    description: 'Returns log data',
    type: AuthResponse
  })
  @ApiConflictResponse({description: 'Code is not valid'})
  @ApiNotFoundResponse({
    description: 'Account not found',
  })
  @Post('verify-otp-register')
  @HttpCode(HttpStatus.OK)
  async verifyRegisterOTP(@Res({ passthrough: true }) res: Response, @Body() dto: VerifyOTPRegister) {
    const {accessToken, account, refreshToken} = await this.client.call('verifyRegisterOtp', dto as RegisterVerifyOtpRequest); 
    this.passTokenViaCookies(res, refreshToken, dto.email);
    return {accessToken, account};
  }

  @ApiOperation({
    summary: 'Login into account',
    description: 'Login into existing account with defined credentials',
  })
  @ApiOkResponse({
    description: 'Returns log data',
    type: AuthResponse
  })
  @ApiNotFoundResponse({description: 'Account not found'})
  @ApiConflictResponse({description: 'Account is not completely registered, Password is not valid'})
  @Post('login')
  async login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginDto) {
    const {accessToken, account, refreshToken} = await this.client.call('login', dto as LoginRequest);
    this.passTokenViaCookies(res, refreshToken, dto.email);
    return {accessToken, account};
  }

  @ApiOperation({
    summary: 'Logout session',
    description: 'Logout from the account',
  })
  @ApiOkResponse({
    description: 'Successfully logged out',
    type: LogoutResponse,
  })
  @ApiBearerAuth()
  @Post('logout')
  // @Protected()
  @HttpCode(HttpStatus.OK)
  public logout(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeCookie(res, CookieType.REFRESH_TOKEN);
    return { status: HttpStatus.OK };
  }

  private passTokenViaCookies(
    response: Response,
    refreshToken: string,
    userData: string,
  ) {
    try {
      this.cookieService.setCookie(
        response,
        CookieType.REFRESH_TOKEN,
        refreshToken,
      );
    } catch (error: any) {
      this.logger.error(
        error?.message || `Unable to pass refres token for ${userData}`,
      );
    }
  }
}
