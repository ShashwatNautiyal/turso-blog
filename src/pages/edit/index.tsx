import React, { useState } from "react";

import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import EditorSection from "@/components/edit/EditorSection";
import InfoSection from "@/components/InfoSection";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPage = () => {
	const router = useRouter();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [mdx, setMdx] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [tags, setTags] = useState<string[]>([""]);

	const [isLoading, setIsLoading] = useState(false);

	const handlePublish = async () => {
		// ...
	};

	const uploadImage = async (image: File) => {
		// ...
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
