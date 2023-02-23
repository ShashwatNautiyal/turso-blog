import axiosInstance from "@/axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [
		GoogleProvider({
			// @ts-ignore
			clientId: process.env.GOOGLE_ID,
			// @ts-ignore
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		GitHubProvider({
			// @ts-ignore
			clientId: process.env.GITHUB_ID,
			// @ts-ignore
			clientSecret: process.env.GITHUB_SECRET,
		}),

		// ...add more providers here
	],
	callbacks: {
		async jwt(data) {
			// Persist the OAuth access_token to the token right after signin

			const { token, account, user } = data;
			if (account) {
				token.user = user;
			}
			return token;
		},
		async session({ session, token }) {
			// Send properties to the client, like an access_token from a provider.
			(session as any).user = token.user;

			return session;
		},
	},
};

export default NextAuth(authOptions);
