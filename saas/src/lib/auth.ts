import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./prisma";
import { render } from "@react-email/components";
import { transporter } from "./mail";
import { NewUserEmail } from "../components/emails/new-user";
import { ActivationLink } from "../components/emails/activation";
import { getUserOrganizations } from "./organization";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: "/sign-in",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET!,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true,
        }),
        EmailProvider({
            from: process.env.EMAIL_FROM,
            sendVerificationRequest: async ({ identifier, url, provider }) => {
                const user = await prisma.user.findUnique({
                    where: {
                        email: identifier,
                    },
                    select: {
                        emailVerified: true,
                    },
                });

                const html = !user?.emailVerified
                    ? render(NewUserEmail({ url }))
                    : render(ActivationLink({ url }));

                const mailOptions = {
                    from: provider.from as string,
                    to: identifier,
                    subject: "Verification of Email",
                    html,
                };
                try {
                    await transporter.sendMail(mailOptions);
                } catch (err) {
                    console.log("ERROR while sending");
                }
            },
        }),
    ],
    callbacks: {
        async session({ token, session }) {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                
                // Add organization context if available
                if (token.organizationId) {
                    session.user.organizationId = token.organizationId;
                    session.user.organizationRole = token.organizationRole;
                    
                    // Fetch organization details if needed
                    if (token.organizationId) {
                        const organization = await prisma.organization.findUnique({
                            where: { id: token.organizationId },
                        });
                        if (organization) {
                            session.user.organization = organization;
                        }
                    }
                }
            }

            return session;
        },
        async jwt({ token, user }) {
            const dbUser = await prisma.user.findFirst({
                where: {
                    email: token.email,
                },
            });

            if (!dbUser) {
                if (user) {
                    token.id = user?.id;
                }
                return token;
            }

            // Get user's default organization and role
            if (dbUser.defaultOrganizationId) {
                const organizationUser = await prisma.organizationUser.findUnique({
                    where: {
                        organizationId_userId: {
                            organizationId: dbUser.defaultOrganizationId,
                            userId: dbUser.id,
                        },
                    },
                });
                
                if (organizationUser) {
                    token.organizationId = dbUser.defaultOrganizationId;
                    token.organizationRole = organizationUser.role;
                }
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
                organizationId: token.organizationId,
                organizationRole: token.organizationRole,
            };
        },
    }
}
