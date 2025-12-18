import { AppService } from './app.service';

/**
 * DB mock – MUST be on top
 */
jest.mock('./db', () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn().mockResolvedValue([
        { id: 1, name: 'Mock User', email: 'mock@test.com' },
      ]),
    })),
    insert: jest.fn(() => ({
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([
        { id: 2, name: 'New User', email: 'new@test.com' },
      ]),
    })),
    update: jest.fn(() => ({
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([
        { id: 1, name: 'Updated User', email: 'updated@test.com' },
      ]),
    })),
    delete: jest.fn(() => ({
      where: jest.fn().mockResolvedValue(undefined),
    })),
  },
}));

describe('AppService (unit)', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  it('getHello()', () => {
    expect(service.getHello()).toBe('Hello World!');
  });

  it('getAllUsers()', async () => {
    const users = await service.getAllUsers();
    expect(users.length).toBe(1);
  });

  it('createUser()', async () => {
    const res = await service.createUser({
      name: 'New User',
      email: 'new@test.com',
    });

    expect(res[0].email).toBe('new@test.com');
  });

  it('updateUser()', async () => {
    const res = await service.updateUser(1, { name: 'Updated User' });
    expect(res[0].name).toBe('Updated User');
  });

  it('deleteUser()', async () => {
    await expect(service.deleteUser(1)).resolves.toBeUndefined();
  });
});
