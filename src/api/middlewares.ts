import { MiddlewaresConfig } from "@medusajs/medusa";
import cors from "cors";
export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: "/custom/*",
      middlewares: [
        cors({
          origin: "http://localhost:7001",
          credentials: true,
        }),
      ],
    },

    // {
    //     matcher: '/custom/confirmation-token/generate',
    //     // middlewares: [authenticateCustomer(), registerLoggedInCustomer],
    // },
  ],
};
