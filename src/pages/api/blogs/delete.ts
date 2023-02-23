// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { connect } from "@libsql/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import axiosInstance from "@/axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const config = {
		url: process.env.NEXT_PUBLIC_DB_URL as string,
	};

	const session = (await getServerSession(req, res, authOptions)) as any;

	// Unauthorized if no session
	if (!session) {
		res.status(401).json({
			message: "Unauthorized",
		});
		return;
	}

	const db = connect(config);

	const { id } = req.query as any;

	if (!id) {
		res.status(400).json({
			message: "No id provided",
		});
		return;
	}

	if (req.method === "GET") {
		const blog = await db.execute(`SELECT * FROM blogs WHERE id=? AND user_id=?`, [
			id,
			session.user.id,
		]);

		if (blog.rows?.length === 0) {
			res.status(500).json({ message: "You can delete only your blogs" });
			return;
		}

		const result = await db.execute(
			`
		    DELETE FROM blogs WHERE id=?
		    `,
			[id]
		);

		if (!result || result.rows?.length === 0) {
			res.status(500).json({ message: "No blogs found" });
			return;
		}

		await axiosInstance.get(
			`/revalidate?path=/blogs&secret=` + process.env.NEXT_PUBLIC_REVALIDATE_TOKEN
		);

		res.status(200).json({
			data: "Blog deleted successfully",
		});
		return;
	}

	res.status(500).json({
		message: "Only supports POST method",
	});
	return;
}
