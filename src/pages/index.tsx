import BlogCard from "@/components/home/BlogCard";
import HeroSection from "@/components/home/HeroSection";
import Layout from "@/components/Layout";
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
	return {
		props: {
			data: [
				{
					content: "## Hello World",
					created_at: "2021-08-01T00:00:00.000Z",
					description: "This is a description",
					id: "1",
					name: "John Doe",
					profileImage: "https://avatars.githubusercontent.com/u/51149960?v=4",
					tags: ["react", "nextjs", "tailwindcss"],
					title: "Hello World",
					user_id: 1,
					email: "abc@gmail.com",
					image:
						"https://res.cloudinary.com/dkz7lhlzv/image/upload/v1677106962/turso-blog/n7ym9fzbsnuvkoftyvyd.png",
				},
			],
		},
	};
};
