import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "@/app/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  user: {
    additionalFields: {
      role: {
        type: ["admin", "writter"],
        required: false,
        defaultValue: "writter",
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },
});