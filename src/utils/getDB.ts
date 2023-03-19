import { createClient } from "@libsql/client";

const getDB = async () => {
	const config = {
		url: process.env.NEXT_PUBLIC_DB_URL as string,
	};
	const db = createClient(config);

	return db;
};

export default getDB;
