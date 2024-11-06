import { ethers } from 'ethers'

export default async function handler(req, res) {
	const { message, signature, address } = req.body

	try {
		// Recover address from signature
		const recoveredAddress = ethers.utils.verifyMessage(message, signature)

		// Check if recovered address matches the provided address
		if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
			res
				.status(200)
				.json({ success: true, message: 'Signature verified successfully' })
		} else {
			res
				.status(400)
				.json({ success: false, message: 'Signature verification failed' })
		}
	} catch (error) {
		console.error('Error verifying signature:', error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
}
