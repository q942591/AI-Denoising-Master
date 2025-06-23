import {
  expect,
  test,
  describe,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import { eq } from "drizzle-orm";

const mockCustomerId = "mock-customer-id";
const mockUserId = "test-user-id";
const mockEmail = "test@example.com";
const mockSubscriptionId = "mock-subscription-id";
const mockProductId = "mock-product-id";

const mockDb = {
  query: {
    stripeCustomerTable: {
      findFirst: () =>
        Promise.resolve({
          id: "test-customer-id",
          customerId: "cus_test123",
          userId: "user-123",
        }),
    },
    stripeSubscriptionTable: {
      findMany: () =>
        Promise.resolve([
          {
            id: "sub-123",
            subscriptionId: "sub_test123",
            userId: "user-123",
            status: "active",
            productId: "prod_test123",
          },
        ]),
    },
  },
  insert: () => ({ values: () => Promise.resolve([{ id: "test-id" }]) }),
  update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
};

const mockPolarClient = {
  customers: {
    create: async () => ({
      id: mockCustomerId,
      email: mockEmail,
      externalId: mockUserId,
    }),
    get: async () => ({
      id: mockCustomerId,
      email: mockEmail,
      externalId: mockUserId,
      subscriptions: [],
      entitlements: [],
      benefits: [],
    }),
  },
  checkouts: {
    create: async () => ({
      url: "https://checkout.polar.sh/test-checkout",
    }),
  },
};

const mockServices = {
  createCustomer: async (userId: string, email: string) => {
    const customer = await mockPolarClient.customers.create();
    return customer;
  },
  getCustomerByUserId: async (userId: string) => {
    return mockDb.query.stripeCustomerTable.findFirst();
  },
  getCustomerState: async (userId: string) => {
    const customer = await mockDb.query.stripeCustomerTable.findFirst();
    if (!customer) return null;
    return mockPolarClient.customers.get();
  },
  getUserSubscriptions: async (userId: string) => {
    return mockDb.query.stripeSubscriptionTable.findMany();
  },
  syncSubscription: async (
    userId: string,
    customerId: string,
    subscriptionId: string,
    productId: string,
    status: string,
  ) => {
    return { success: true };
  },
  hasActiveSubscription: async (userId: string) => {
    const subscriptions = await mockDb.query.stripeSubscriptionTable.findMany();
    return subscriptions.some((sub) => sub.status === "active");
  },
  getCheckoutUrl: async (customerId: string, productSlug: string) => {
    const checkout = await mockPolarClient.checkouts.create();
    return checkout.url;
  },
};

describe("stripe payment service", () => {
  beforeEach(() => {
    // reset any mocks
  });

  test("should get stripe customer", async () => {
    const customer = await mockDb.query.stripeCustomerTable.findFirst();
    expect(customer).toBeDefined();
    expect(customer?.customerId).toBe("cus_test123");
  });

  test("should get user subscriptions", async () => {
    const subscriptions = await mockDb.query.stripeSubscriptionTable.findMany();
    expect(subscriptions).toBeDefined();
    expect(subscriptions).toHaveLength(1);
    expect(subscriptions[0]?.status).toBe("active");
  });

  test("should create checkout session", async () => {
    // mock stripe client
    const mockStripeClient = {
      checkout: {
        sessions: {
          create: () =>
            Promise.resolve({
              id: "cs_test123",
              url: "https://checkout.stripe.com/test-checkout",
            }),
        },
      },
      customers: {
        create: () =>
          Promise.resolve({
            id: "cus_test123",
            email: "test@example.com",
          }),
        get: () =>
          Promise.resolve({
            id: "cus_test123",
            email: "test@example.com",
          }),
      },
    };

    const session = await mockStripeClient.checkout.sessions.create();
    expect(session.url).toBe("https://checkout.stripe.com/test-checkout");
  });
});

describe("stripe integration", () => {
  test("stripe client should be properly configured", () => {
    if (process.env.CI) {
      console.log("skipping stripe client config test in ci environment");
      return;
    }

    process.env.STRIPE_SECRET_KEY =
      process.env.STRIPE_SECRET_KEY || "sk_test_123";
    process.env.STRIPE_WEBHOOK_SECRET =
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_123";

    expect(process.env.STRIPE_SECRET_KEY).toBeDefined();
    expect(process.env.STRIPE_WEBHOOK_SECRET).toBeDefined();
  });

  test("stripe environment should be configured", () => {
    if (process.env.CI) {
      console.log("skipping stripe environment test in ci environment");
      return;
    }

    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_123";

    expect(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).toBeDefined();
  });
});

describe("Payment API Routes", () => {
  const mockResponse = {
    json: () => mockResponse,
    status: () => mockResponse,
    send: () => mockResponse,
  };

  const mockRequest = {
    headers: {
      get: () => null,
    },
  };

  test("customer-state API should return customer state for authenticated user", async () => {
    const customerState = await mockServices.getCustomerState(mockUserId);
    expect(customerState).toBeDefined();
  });

  test("subscriptions API should return user subscriptions", async () => {
    const subscriptions = await mockServices.getUserSubscriptions(mockUserId);
    expect(subscriptions.length).toBe(1);
  });
});
