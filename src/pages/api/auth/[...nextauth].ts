import getDB from "@/utils/getDB";
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
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
		// ...add more providers here
	],
	callbacks: {
		async signIn(user) {
			const session = user as any;
			try {
				const db = await getDB();

				const user = await db.execute("SELECT * FROM users WHERE id = ?", [session.user.id]);

				if (user.rows?.length === 0) {
					const user = await db.execute(
						"INSERT INTO users (id, name, email, profileImage) VALUES (?, ?, ?, ?)",
						[session.user.id.toString(), session.user.name, session.user.email, session.user.image]
					);

					if (user.error) {
						return false;
					}

					return true;
				}

				return true;
			} catch (error: any) {
				console.log(error.message);
				return false;
			}
		},
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
