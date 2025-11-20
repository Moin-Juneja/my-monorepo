import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('users')
  async getAllUsers() {
    try {
      const result = await this.appService.getAllUsers();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
  @Post('createUser')
  async createUser(@Body() createUserDto: any): Promise<any> {
    try {
      const result = await this.appService.createUser(createUserDto);
      return {
        success: true,
        data: result[0], // returning() returns an array
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Put('updateUser/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    try {
      const result = await this.appService.updateUser(+id, updateUserDto);
      if (result.length === 0) {
        return {
          success: false,
          error: 'User not found',
        };
      }
      return {
        success: true,
        data: result[0], // returning() returns an array
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Delete('deleteUser/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      await this.appService.deleteUser(+id);
      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
