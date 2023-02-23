// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { connect } from "@libsql/client";

import { serializeData } from "../user";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const config = {
		url: process.env.NEXT_PUBLIC_DB_URL as string,
	};

	const db = connect(config);

	if (req.method === "GET") {
		const blogs = await db.execute(
			`select * from users INNER JOIN blogs where users.id=blogs.user_id`
		);
		const _result = serializeData(blogs);

		const result = _result?.map((blog: any) => {
			return {
				...blog,
				tags: blog.tags.split(","),
			};
		});

		if (!result) {
			res.status(500).json({ message: "No blogs found" });
			return;
		}

		res.status(200).json({
			data: result,
		});

		return;
	}

	res.status(500).json({
		message: "Only supports GET method",
	});

	return;
}
