/**
 * ⚠️ MOCK DATA — for UI development only.
 *
 * A small hand-written sample repository so the workspace (explorer, tabs, editor) can be built
 * before repository ingestion exists. It is not the result of importing or analysing anything,
 * and the UI labels it as "Demo data" wherever it appears.
 */
import type { ProjectDetail } from "../types";

const files: Record<string, string> = {
  "README.md": `# checkout-service (demo)

Sample Express + TypeScript service bundled with Lens for UI development.
It is **mock data** — not an imported repository.
`,
  "package.json": `{
  "name": "checkout-service",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "test": "vitest run"
  },
  "dependencies": {
    "express": "^4.19.2",
    "zod": "^3.23.8"
  }
}
`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
`,
  "src/index.ts": `import express from "express";
import { checkoutRouter } from "./routes/checkout";

const app = express();
app.use(express.json());
app.use("/api/checkout", checkoutRouter);

app.listen(3000, () => {
  console.log("checkout-service listening on :3000");
});
`,
  "src/routes/checkout.ts": `import { Router } from "express";
import { checkoutSchema } from "../validation/checkout-schema";
import { createOrder } from "../services/order-service";

export const checkoutRouter = Router();

checkoutRouter.post("/", async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }

  const order = await createOrder(parsed.data);
  return res.status(201).json(order);
});
`,
  "src/validation/checkout-schema.ts": `import { z } from "zod";

export const checkoutSchema = z.object({
  customerId: z.string().uuid(),
  items: z
    .array(z.object({ sku: z.string(), quantity: z.number().int().positive() }))
    .min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
`,
  "src/services/order-service.ts": `import type { CheckoutInput } from "../validation/checkout-schema";
import { db } from "../db/client";
import { priceItems } from "./pricing";

export interface Order {
  id: string;
  customerId: string;
  totalCents: number;
}

export async function createOrder(input: CheckoutInput): Promise<Order> {
  const totalCents = await priceItems(input.items);
  return db.orders.insert({ customerId: input.customerId, totalCents });
}
`,
  "src/services/pricing.ts": `import { db } from "../db/client";

export async function priceItems(items: { sku: string; quantity: number }[]): Promise<number> {
  let total = 0;
  for (const item of items) {
    const product = await db.products.findBySku(item.sku);
    if (!product) throw new Error("Unknown SKU: " + item.sku);
    total += product.priceCents * item.quantity;
  }
  return total;
}
`,
  "src/db/client.ts": `// In-memory stand-in for a database client.
const orders: { id: string; customerId: string; totalCents: number }[] = [];
const products = new Map([["SKU-1", { sku: "SKU-1", priceCents: 1299 }]]);

export const db = {
  orders: {
    async insert(row: { customerId: string; totalCents: number }) {
      const order = { id: crypto.randomUUID(), ...row };
      orders.push(order);
      return order;
    },
  },
  products: {
    async findBySku(sku: string) {
      return products.get(sku) ?? null;
    },
  },
};
`,
  "tests/order-service.test.ts": `import { describe, expect, it } from "vitest";
import { createOrder } from "../src/services/order-service";

describe("createOrder", () => {
  it("prices items and stores the order", async () => {
    const order = await createOrder({
      customerId: "6f1c2a3e-0000-4000-8000-000000000000",
      items: [{ sku: "SKU-1", quantity: 2 }],
    });
    expect(order.totalCents).toBe(2598);
  });
});
`,
};

export const demoProjectFiles: Readonly<Record<string, string>> = files;

export const demoProject: ProjectDetail = {
  id: "demo-checkout-service",
  name: "checkout-service",
  description: "Sample Express + TypeScript service used to develop the workspace UI.",
  source: { kind: "demo" },
  commit: null,
  primaryLanguage: "TypeScript",
  fileCount: Object.keys(files).length,
  indexingStatus: "not_indexed",
  updatedAt: "2026-11-21T00:00:00.000Z",
  filePaths: Object.keys(files),
};
