import BlogCard from "@/components/home/BlogCard";
import HeroSection from "@/components/home/HeroSection";
import Layout from "@/components/Layout";
import getDB from "@/utils/getDB";
import getJSON from "@/utils/getJSON";
import { InferGetServerSidePropsType } from "next";
import { Blog } from "..";

export default function Home({ data }: InferGetServerSidePropsType<typeof getStaticProps>) {
	return (
		<Layout>
			<div className="mb-16">
				{data && data.length > 0 && <HeroSection {...data[0]} />}
				<div className="grid grid-cols-3 gap-8 mt-8">
					{data && data.slice(1).map((blog: any) => <BlogCard key={blog.title} {...blog} />)}
				</div>
			</div>
		</Layout>
	);
}

export const getStaticProps = async () => {
	try {
		const db = await getDB();

		const blogs = await db.execute(
			`select * from users INNER JOIN blogs where users.id=blogs.user_id`
		);

		const _result = getJSON(blogs);

		const result = _result?.map((blog: any) => {
			return {
				...blog,
				tags: blog.tags.split(","),
			};
		}) as Blog[] | undefined;

		return {
			props: {
				data: result ? result : [],
			},
		};
	} catch (error) {
		return {
			props: {
				data: [],
			},
		};
	}
};
