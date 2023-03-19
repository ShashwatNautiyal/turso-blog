import { ResultSet } from "@libsql/client";

const getJSON = (data: ResultSet) => {
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

export default getJSON;
