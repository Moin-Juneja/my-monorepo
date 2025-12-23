import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController (unit)', () => {
  let controller: AppController;
  let service: jest.Mocked<AppService>;

  const mockAppService = {
    getHello: jest.fn(),
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET / → Hello World', () => {
    service.getHello.mockReturnValue('Hello Guys!');
    expect(controller.getHello()).toBe('Hello Guys!');
  });

  it('GET /users → success', async () => {
    service.getAllUsers.mockResolvedValue([]);

    const res = await controller.getAllUsers();

    expect(res.success).toBe(true);
    expect(res.data).toEqual([]);
  });

  it('POST /createUser → success', async () => {
    service.createUser.mockResolvedValue([
      { id: 1, name: 'John', email: 'john@test.com' },
    ]);

    const res = await controller.createUser({
      name: 'John',
      email: 'john@test.com',
    });

    expect(res.success).toBe(true);
    expect(res.data?.name).toBe('John'); // ? added to avoid undefined TS error
  });

  it('PUT /updateUser/:id → success', async () => {
    service.updateUser.mockResolvedValue([
      { id: 1, name: 'Updated User', email: 'updated@test.com' },
    ]);

    const res = await controller.updateUser('1', { name: 'Updated User' });

    expect(res.success).toBe(true);
    expect(res.data?.name).toBe('Updated User');
    expect(res.data?.email).toBe('updated@test.com');
  });

  it('PUT /updateUser/:id → user not found', async () => {
    service.updateUser.mockResolvedValue([]);

    const res = await controller.updateUser('99', {});

    expect(res.success).toBe(false);
    expect(res.error).toBe('User not found');
  });

  it('DELETE /deleteUser/:id → success', async () => {
    service.deleteUser.mockResolvedValue(undefined);

    const res = await controller.deleteUser('1');

    expect(res.success).toBe(true);
    expect(res.message).toBe('User deleted successfully');
  });
});
