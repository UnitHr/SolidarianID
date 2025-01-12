import { HttpStatus, INestApplication } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import request from 'supertest';
import { envs } from '@communities-ms/config/envs';
import * as jwt from 'jsonwebtoken';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { ConfigModule } from '@nestjs/config';
import { ActionModule } from '@communities-ms/actions/action.module';
import * as Persistence from '../src/actions/infra/persistence';

describe('ActionModule (e2e)', () => {
  let app: INestApplication;
  let actionModel: Model<Persistence.Action>;
  let token: string;

  // Define actions for the tests
  const predefinedActions = [
    {
      id: new UniqueEntityID().toString(),
      status: 'PENDING',
      type: 'economic',
      title: 'Action 1',
      description: 'Description 1',
      causeId: '1',
      target: 100,
      unit: 'euros',
      achieved: 0,
      createdBy: '1',
      communityId: '1',
    },
    {
      id: new UniqueEntityID().toString(),
      status: 'PENDING',
      type: 'goods_collection',
      title: 'Action 2',
      description: 'Description 2',
      causeId: '1',
      target: 100,
      unit: 'items',
      achieved: 0,
      createdBy: '1',
      communityId: '1',
      goodType: 'clothes',
    },
    {
      id: new UniqueEntityID().toString(),
      status: 'PENDING',
      type: 'volunteer',
      title: 'Action 3',
      description: 'Description 3',
      causeId: '1',
      target: 100,
      unit: 'hours',
      achieved: 0,
      createdBy: '1',
      communityId: '1',
      location: 'Paris',
      date: new Date('2021-12-01'),
    },
  ];

  let predefinedActionsIds: string[];

  // Setup the app and the action model
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ActionModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_URI),

        MongooseModule.forFeature([
          { name: 'Action', schema: Persistence.ActionSchema },
        ]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    actionModel = moduleFixture.get<Model<Persistence.Action>>(
      getModelToken('Action'),
    );
    // Create a token for the tests
    const id = new UniqueEntityID().toString();
    const payload = { sub: id, email: 'user@gmail.com', roles: 'user' };

    token = jwt.sign(payload, envs.jwtSecret, {
      expiresIn: '1h',
    });

    await app.init();

    // Clean the database and insert the predefined actions
    await actionModel.deleteMany({});
    const insertedActions = await actionModel.insertMany(predefinedActions);
    predefinedActionsIds = insertedActions.map((action) => action.id);
  });

  // Close the app and the database connection
  afterAll(async () => {
    await app.close();
    await mongoose.connection.close();
  });

  // Test the endpoints
  describe('GET /actions/:id', () => {
    it('should return action details for a valid id', async () => {
      const id = predefinedActionsIds[0];
      const response = await request(app.getHttpServer()).get(`/actions/${id}`);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toHaveProperty('id', predefinedActionsIds[0]);
      expect(response.body).toHaveProperty('title', 'Action 1');
    });
    it('should return 404 for an invalid id', async () => {
      const id = new UniqueEntityID().toString();
      const response = await request(app.getHttpServer()).get(`/actions/${id}`);
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('GET /actions', () => {
    it('should return paginated actions', async () => {
      const response = await request(app.getHttpServer()).get(
        '/actions?page=1&limit=2',
      );

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.total).toBe(predefinedActions.length);
    });
  });

  describe('POST /actions/:id/contributions', () => {
    it('should create a contribution and return 201', async () => {
      const id = predefinedActionsIds[0];
      const contributionPayload = {
        date: new Date('2025-01-24').toISOString(),
        amount: 50,
        unit: 'euros',
      };
      const response = await request(app.getHttpServer())
        .post(`/actions/${id}/contributions`)
        .set('Authorization', `Bearer ${token}`)
        .send(contributionPayload);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toHaveProperty('id');
      await expect(actionModel.findOne({ id })).resolves.toHaveProperty(
        'status',
        'IN_PROGRESS',
      );
    });

    it('should return 400 Bad Request for invalid unit field', async () => {
      const id = predefinedActionsIds[2];
      const contributionPayload = {
        date: new Date('2025-01-24').toISOString(),
        amount: 50,
        unit: 'euros',
      };
      const response = await request(app.getHttpServer())
        .post(`/actions/${id}/contributions`)
        .set('Authorization', `Bearer ${token}`)
        .send(contributionPayload);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /actions/:id/contributions', () => {
    it('should return paginated contributions', async () => {
      const id = predefinedActionsIds[0];
      const response = await request(app.getHttpServer())
        .get(`/actions/${id}/contributions?page=1&limit=2`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.meta.total).toBe(1);
    });
  });
});
