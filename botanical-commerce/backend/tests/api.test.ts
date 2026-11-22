import request from 'supertest';
import app from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { runSeed } from '../src/utils/seedDatabase.js';

describe('Aranya Botanicals API Test Suite', () => {
  beforeAll(async () => {
    await connectDatabase();
    await runSeed();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('1. Health & Meta Endpoints', () => {
    it('GET /health returns healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toContain('Aranya Botanicals');
    });
  });

  describe('2. Authentication Endpoints', () => {
    it('POST /api/v1/auth/login validates credentials and returns tokens', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'customer@aranyabotanicals.com',
        password: 'Customer@2026',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.user.email).toBe('customer@aranyabotanicals.com');
    });

    it('POST /api/v1/auth/register creates a new user account', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Rohit Kulkarni',
        email: 'rohit.test@example.com',
        password: 'SecurePassword123',
        phone: '+919988776655',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('rohit.test@example.com');
    });
  });

  describe('3. Products Endpoints', () => {
    it('GET /api/v1/products returns seeded botanical concentrate list', async () => {
      const res = await request(app).get('/api/v1/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.products.length).toBeGreaterThan(0);
      expect(res.body.pagination).toBeDefined();
    });

    it('GET /api/v1/products/:slug returns single product with serving ratio', async () => {
      const res = await request(app).get('/api/v1/products/wild-western-ghats-kokum-concentrate');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.product.name).toContain('Kokum');
      expect(res.body.data.product.dilutionRatio).toBeDefined();
      expect(res.body.data.product.variants.length).toBeGreaterThan(0);
    });
  });

  describe('4. Botanicals & Recipes Endpoints', () => {
    it('GET /api/v1/botanicals returns all 4 core Indian botanicals', async () => {
      const res = await request(app).get('/api/v1/botanicals');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(4);
    });

    it('GET /api/v1/recipes returns mocktail and sparkling recipes', async () => {
      const res = await request(app).get('/api/v1/recipes');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('5. Cart & Order Commerce Flow', () => {
    let guestToken = 'test-guest-token-12345';
    let productId = '';
    let variantSku = '';

    beforeAll(async () => {
      const res = await request(app).get('/api/v1/products');
      const kokum = res.body.products.find((p: any) => p.slug.includes('kokum'));
      productId = kokum._id;
      variantSku = kokum.variants[0].sku;
    });

    it('POST /api/v1/cart/items adds botanical product to guest cart', async () => {
      const res = await request(app)
        .post('/api/v1/cart/items')
        .set('x-guest-token', guestToken)
        .send({
          productId,
          variantSku,
          quantity: 2,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBe(1);
      expect(res.body.data.subtotalInPaise).toBeGreaterThan(0);
    });

    it('POST /api/v1/cart/coupon applies BOTANICAL10 discount code', async () => {
      const res = await request(app)
        .post('/api/v1/cart/coupon')
        .set('x-guest-token', guestToken)
        .send({ code: 'BOTANICAL10' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.discountInPaise).toBeGreaterThan(0);
    });

    it('POST /api/v1/orders creates order with integer minor units (paise)', async () => {
      const res = await request(app)
        .post('/api/v1/orders')
        .set('x-guest-token', guestToken)
        .send({
          customerEmail: 'test.buyer@example.com',
          customerPhone: '9876543210',
          shippingAddress: {
            fullName: 'Test Buyer',
            phone: '9876543210',
            streetAddress: '42 Marine Drive, Nariman Point',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400021',
            country: 'India',
          },
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.orderNumber).toMatch(/^AB-\d{8}-\d{4}$/);
      expect(res.body.data.totalAmountInPaise).toBeGreaterThan(0);
      expect(res.body.data.status).toBe('PENDING');
    });
  });

  describe('6. B2B Wholesale Flow', () => {
    it('POST /api/v1/b2b/enquiries receives commercial wholesale request', async () => {
      const res = await request(app).post('/api/v1/b2b/enquiries').send({
        businessName: 'Olive Coastal Bistro & Bar',
        contactPerson: 'Chef Raghavendra Rao',
        email: 'raghav@olivebar.in',
        phone: '9812345678',
        businessType: 'RESTAURANT',
        city: 'Bengaluru',
        state: 'Karnataka',
        estimatedMonthlyVolumeLiters: 40,
        message: 'Looking for Nannari and Kokum concentrate supply for our seasonal summer cocktail menu.',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('NEW');
    });
  });

  describe('7. Admin Protected Endpoints', () => {
    let adminToken = '';

    beforeAll(async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'admin@aranyabotanicals.com',
        password: 'Botanicals@Admin2026',
      });
      adminToken = res.body.data.accessToken;
    });

    it('GET /api/v1/admin/dashboard returns operational KPIs', async () => {
      const res = await request(app)
        .get('/api/v1/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalOrders).toBeDefined();
      expect(res.body.data.totalCustomers).toBeDefined();
    });

    it('GET /api/v1/admin/inventory returns variant stock levels', async () => {
      const res = await request(app)
        .get('/api/v1/admin/inventory')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });
});
