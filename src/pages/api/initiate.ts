// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { connect } from "@libsql/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
	const config = {
		url: process.env.NEXT_PUBLIC_DB_URL as string,
	};
	const db = connect(config);

	// await db.execute(`
	// create table users (
	//     id varchar2 primary key not null,
	//     name varchar2 not null,
	//     email varchar2 not null,
	//     profileImage varchar2 not null,
	//     created_at timestamp default current_timestamp
	// );
	// `);

	// await db.execute(`
	// create table blogs (
	//     id integer primary key AUTOINCREMENT,
	//     title varchar2 not null,
	//     description varchar2 not null,
	// 	tags varchar2 not null,
	// 	image varchar2 not null,
	//     content varchar2 not null,
	// 	created_at timestamp default current_timestamp,
	// 	user_id varchar2,
	//     foreign key (user_id) references users(id)
	// );
	// `);

	if (db) {
		res.status(200).json({
			status: "DB Connected",
		});
	}

	res.status(500).json({
		status: "DB Not Connected",
	});
}
