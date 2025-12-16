import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  // Full mock including getHello
  const mockAppService = {
    getHello: jest.fn().mockReturnValue('Hello World!'),
    getAllUsers: jest.fn().mockResolvedValue([
      { id: 1, name: 'E2E User', email: 'e2e@test.com' },
    ]),
    createUser: jest.fn().mockResolvedValue([
      { id: 2, name: 'E2E User', email: 'e2e@test.com' },
    ]),
    updateUser: jest.fn().mockResolvedValue([
      { id: 1, name: 'Updated E2E User', email: 'updated@test.com' },
    ]),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(mockAppService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/users (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0].name).toBe('E2E User');
  });

  it('/createUser (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/createUser')
      .send({
        name: 'E2E User',
        email: 'e2e@test.com',
        password: '123',
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('E2E User');
  });

  it('/updateUser/:id (PUT)', async () => {
    const res = await request(app.getHttpServer())
      .put('/updateUser/1')
      .send({ name: 'Updated E2E User' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Updated E2E User');
  });

  it('/deleteUser/:id (DELETE)', async () => {
    const res = await request(app.getHttpServer())
      .delete('/deleteUser/1')
      .expect(200);

    expect(res.body.success).toBe(true);
  });
});
