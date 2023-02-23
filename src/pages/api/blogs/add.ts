// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { connect } from "@libsql/client";

import { authOptions } from "../auth/[...nextauth]";

import axiosInstance from "@/axios";
import { serializeData } from "../user";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const session = (await getServerSession(req, res, authOptions)) as any;

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

	const { title, description, tags, image, content } = req.body;

	if (!title || !description || !tags || !image || !content) {
		res.status(400).json({
			message: "Fields cannot be empty",
		});
		return;
	}

	const blog = await db.execute(
		"INSERT INTO blogs (title, description, tags, image, content, user_id) VALUES (?, ?, ?, ?, ?, ?)",
		[title, description, tags, image, content, session.user.id]
	);

	const blogResult = await db.execute(
		`
            select id from blogs where user_id=? order by id desc limit 1
        `,
		[session.user.id]
	);

	const result = serializeData(blogResult);

	if (blog.error || !result) {
		res.status(500).json({
			message: blog.error,
		});
		return;
	}

	await axiosInstance.get(
		`api/revalidate?path=/&secret=` + process.env.NEXT_PUBLIC_REVALIDATE_TOKEN
	);

	res.status(201).json({
		data: result[0],
	});

	return;
}
