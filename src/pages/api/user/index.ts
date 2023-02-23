// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { connect, ResultSet } from "@libsql/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const session = req.body as {
		user: {
			id: number | string;
			name: string;
			email: string;
			image: string;
		};
		expires: string;
	};

	// Unauthorized if no session
	if (!session) {
		res.status(401).json({
			message: "Unauthorized",
		});
		return;
	}

	// Create db connection
	const config = {
		url: process.env.NEXT_PUBLIC_DB_URL as string,
	};
	const db = connect(config);

	if (req.method === "POST") {
		// Unauthorized if no session
		if (!session) {
			res.status(401).json({
				message: "Unauthorized",
			});
			return;
		}

		const user = await db.execute("SELECT * FROM users WHERE id = ?", [session.user.id]);

		if (user.rows?.length === 0) {
			const user = await db.execute(
				"INSERT INTO users (id, name, email, profileImage) VALUES (?, ?, ?, ?)",
				[session.user.id.toString(), session.user.name, session.user.email, session.user.image]
			);

			if (user.error) {
				res.status(500).json({
					message: user.error,
				});
				return;
			}

			res.status(201).json({
				data: "Success - User created",
			});
			return;
		}

		res.status(200).json({
			data: "Success",
		});
		return;
	}
}

export const serializeData = (data: ResultSet) => {
	const { columns, rows } = data;

	if (!rows || !columns) return null;

	let result: Record<any, any> | null = [];

	for (let i = 0; i < rows.length; i++) {
		const object: any = {};
		for (let j = 0; j < columns.length; j++) {
			object[columns[j]] = rows[i][j];
		}
		result.push(object);
	}

	if (result.length === 0) {
		return null;
	}

	return result;
};
