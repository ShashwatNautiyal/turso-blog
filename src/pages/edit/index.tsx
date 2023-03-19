import React, { useState } from "react";

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import EditorSection from "@/components/edit/EditorSection";
import InfoSection from "@/components/InfoSection";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import axiosInstance from "@/axios";
import { slug } from "github-slugger";

const EditPage = () => {
	const router = useRouter();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [mdx, setMdx] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [tags, setTags] = useState<string[]>([""]);

	const [isLoading, setIsLoading] = useState(false);

	const handlePublish = async () => {
		setIsLoading(true);
		if (!image || !title || !description || !mdx || tags.length === 0 || tags[0] === "") {
			toast.error("Please fill all the fields");
			setIsLoading(false);
			return;
		}

		const isTagsValid = tags.every((tag) => tag.search(",") === -1);

		if (!isTagsValid) {
			toast.error("Tags cannot contain commas (,)");
			setIsLoading(false);
			return;
		}

		let url: any;

		try {
			url = await uploadImage(image);

			const data = {
				title,
				description,
				content: mdx,
				image: url.secure_url,
				tags: tags.join(","),
			};

			const { data: blogData } = await axiosInstance.post("api/blogs/add", data);
			toast.success("Blog published successfully");

			console.log(blogData);
			router.push(`/blog/${slug(title)}-${blogData.data.id}`);
		} catch (error) {
			toast.error("Unable to publish blog");
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const uploadImage = async (image: File) => {
		const formData = new FormData();
		formData.append("file", image);
		formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET_NAME as string);
		formData.append("folder", "turso-blog-demo");

		try {
			const res = await axios.post(
				`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			return res.data;
		} catch (error) {
			return error;
		}
	};

	const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	return (
		<div>
			<ToastContainer icon={false} className="text-sm font-medium whitespace-pre-line" />
			<InfoSection
				title={{
					value: title,
					onChange: handleTitle,
				}}
				description={{
					value: description,
					onChange: (e) => {
						setDescription(e.target.value);
					},
				}}
				blogTags={{
					value: tags,
					onChange: setTags,
				}}
				coverImage={{
					value: image,
					onChange: setImage,
				}}
				isInput
				isLoading={isLoading}
			/>
			<EditorSection
				isLoading={isLoading}
				plainMdx={mdx}
				setPlainMdx={setMdx}
				handlePublish={handlePublish}
			/>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: {
			showHeader: false,
		},
	};
};

export default EditPage;
