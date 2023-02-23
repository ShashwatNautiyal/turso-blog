import React from "react";

import Image from "next/image";
import Link from "next/link";
import { BsDot } from "react-icons/bs";
import { MdArrowUpward } from "react-icons/md";

import { Blog } from "@/index";

const BlogCard = (props: Blog) => {
	const { title, description, created_at, image, tags, name, id } = props;
	return (
		<Link href={`/blog/${title}-${id}`} className="mt-8">
			<div className="w-full h-[240px] relative">
				<Image
					sizes="100%"
					className="border"
					style={{
						objectFit: "cover",
						objectPosition: "center center",
					}}
					fill
					alt={title}
					src={image}
				/>
			</div>

			<div className="text-black flex flex-col gap-3 mt-6">
				<div className="flex  items-center text-sm font-semibold">
					{name}
					<BsDot />
					{new Date(created_at).toLocaleDateString("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					})}
				</div>

				<div className="flex gap-4 text-3xl font-medium">
					{title}
					<MdArrowUpward className="rotate-[45deg] h-8 w-8" />
				</div>

				<div>{description}</div>

				<div className="flex gap-2 mt-2">
					{tags?.map((tag, index) => (
						<div
							key={index}
							className="border-[1.5px] border-black font-medium w-fit px-2 rounded-full text-sm"
						>
							{tag}
						</div>
					))}
				</div>
			</div>
		</Link>
	);
};

export default BlogCard;
