import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const baseUrl='http://localhost:3030/api';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3030);

    prisma = app.get(PrismaService);
    await prisma.cleanDb(); 
    
    pactum.request.setBaseUrl(baseUrl);
    
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Endpoint test', () => {
    const email = 'test@gmail.com';
    const password = 'secure123';

    let ids = {
      transaction: '',
      transactionitem: '',
      user: '',
      item: ''
    };

    it('should register a new user', async () => {
      await pactum.spec()
        .post(`${baseUrl}/auth/signup`)
        .withBody({ email, password, username: 'testuser' })
        .expectStatus(201);
    });

    it('should log in and get JWT', async () => {
      await pactum.spec()
        .post(`${baseUrl}/auth/signin`)
        .withBody({ email, password })
        .expectStatus(201)
        .stores('token','token');
    });

    const createBody = {
      transaction: { user_id: 'placeholder-uuid' },
      transactionitem: { item_id: 'placeholder-uuid',transaction_id: 'placeholder-uuid', amount: 2 },
      user: { email: 'user@gmail.com', password: 'userpass', username: 'user1' },
      item: { name: 'Item', price: 50.99, desc: 'description' }
    };

    const updateBody = {
      transaction: { user_id: 'placeholder-uuid' },
      transactionitem: { amount: 5 },
      user: {  username: 'newuser' },
      item: { price: 50.99, desc: 'updated desc' }
    };

    const endpoints = [ 'user', 'item','transaction', 'transactionitem'];

    endpoints.forEach((entity) => {
      describe(`${entity} endpoint`, () => {
        it(`should reject create ${entity} without auth`, async () => {
          await pactum.spec()
            .post(`${baseUrl}/${entity}`)
            .withBody(createBody[entity])
            .expectStatus(401);
        });

        it(`should create ${entity} with auth`, async () => {
          if (entity === 'transaction') {
            createBody.transaction.user_id = ids.user;
            updateBody.transaction.user_id = "79b27b7f-4576-48bb-b801-7f43c662d6ed";
          
          }
          if(entity === 'transactionitem'){
            createBody.transactionitem.transaction_id = ids.transaction;
            createBody.transactionitem.item_id = ids.item;
          }
          const id = await pactum.spec()
              .post(`${baseUrl}/${entity}`)
              .withBearerToken('$S{token}')
              .withBody(createBody[entity])
              .expectStatus(201)
              .returns('data');

            console.log(id);
            ids[entity] = id.id;
        });

        it(`should get many ${entity}`, async () => {
          await pactum.spec()
            .get(`${baseUrl}/${entity}`)
            .withBearerToken('$S{token}')
            .expectStatus(200);
        });

        it(`should get one ${entity}`, async () => {
          const id = ids[entity]
          await pactum.spec()
            .get(`${baseUrl}/${entity}/${id}`)
            .withBearerToken('$S{token}')
            .expectStatus(200);
        });

        it(`should update ${entity}`, async () => {
          const id = ids[entity]
          await pactum.spec()
            .patch(`${baseUrl}/${entity}/${id}`)
            .withBearerToken('$S{token}')
            .withBody(updateBody[entity])
            .expectStatus(200);
        });

        it(`should delete ${entity}`, async () => {
          const id = ids[entity]
          await pactum.spec()
            .delete(`${baseUrl}/${entity}/${id}`)
            .withBearerToken('$S{token}')
            .expectStatus(200);
        });

        it(`should create ${entity} for next entity`, async () => {
          if (entity === 'transaction') {
            createBody.transaction.user_id = ids.user;
            updateBody.transaction.user_id = "79b27b7f-4576-48bb-b801-7f43c662d6ed";
          
          }
          if(entity === 'transactionitem'){
            createBody.transactionitem.transaction_id = ids.transaction;
            createBody.transactionitem.item_id = ids.item;
          }
          const id = await pactum.spec()
              .post(`${baseUrl}/${entity}`)
              .withBearerToken('$S{token}')
              .withBody(createBody[entity])
              .expectStatus(201)
              .returns('data');

            console.log(id);
            ids[entity] = id.id;
        });

        it(`should reject get ${entity} by id without auth`, async () => {
          await pactum.spec()
            .get(`${baseUrl}/${entity}/${ids[entity]}`)
            .expectStatus(401);
        });
      });
    });
  });

});
