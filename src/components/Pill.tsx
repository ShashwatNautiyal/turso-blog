import React from "react";

import { RxCrossCircled } from "react-icons/rx";

const Pill = ({
	text,
	isInput = false,
	onClose,
	showClose = false,
	placeholder,
}: {
	text: {
		value: string;
		onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	};
	onClose?: () => void;
	isInput?: boolean;
	showClose?: boolean;
	placeholder?: string;
}) => {
	const { value, onChange } = text ?? {};

	return isInput ? (
		<div className="relative">
			<input
				placeholder={placeholder}
				value={value}
				disabled={!isInput}
				onChange={onChange}
				className="border-[1.5px] outline-none border-inherit font-medium w-[100px] bg-transparent px-2 rounded-full text-sm placeholder:text-gray-300"
			/>
			{showClose && (
				<RxCrossCircled
					size={20}
					onClick={onClose}
					className="absolute -top-[12px] -right-[8px] text-white hover:scale-[1.1] cursor-pointer"
				/>
			)}
		</div>
	) : (
		<div className="border-[1.5px] border-inherit font-medium w-fit bg-transparent px-2 rounded-full text-sm">
			{value}
		</div>
	);
};

export default Pill;
