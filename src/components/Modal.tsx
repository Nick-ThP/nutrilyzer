import React, { ReactNode, useEffect, useRef } from 'react'
import { FaTimesCircle } from 'react-icons/fa'

interface Props {
	children: ReactNode
	isOpen: boolean
	onClose: () => void
}

export const Modal = ({ children, isOpen, onClose }: Props) => {
	const dialogRef = useRef<HTMLDialogElement>(null)

	const handleClose = () => {
		onClose()
		dialogRef.current?.close()
	}

	useEffect(() => {
		if (isOpen) {
			dialogRef.current?.showModal()
		}
	}, [isOpen])

	return (
		<>
			{isOpen && (
				<dialog ref={dialogRef}>
					{children}
					<button onClick={handleClose} className='close'>
						<FaTimesCircle />
					</button>
				</dialog>
			)}
		</>
	)
}

export default Modal
