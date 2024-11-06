'use client'

import { useState, useEffect } from 'react'
import { useWeb3 } from '../context/Web3Context'
import { ethers } from 'ethers'
import UserRegistry from '../../blockchain/artifacts/contracts/UserRegistry.sol/UserRegistry.json'

declare global {
	interface Window {
		ethereum?: any
	}
}

export default function Home() {
	const { account, connect, disconnect, isConnected, chainId } = useWeb3()
	const [address, setAddress] = useState<string>('')
	const [signature, setSignature] = useState<string>('')
	const [message, setMessage] = useState<string>(
		'Welcome to Virtual Ethiopia! Please sign this message to verify your identity.'
	)
	const [verificationStatus, setVerificationStatus] = useState<string | null>(
		null
	)

	// Connect wallet function
	const connectWallet = async (): Promise<void> => {
		if (!window.ethereum) {
			alert('MetaMask is not installed!')
			return
		}

		try {
			const provider = new ethers.BrowserProvider(window.ethereum)
			// await provider.send('eth_requestAccounts', [])
			const signer = await provider.getSigner()
			const userAddress = await signer.getAddress()
			setAddress(userAddress)

			const CONTRACT_ADDRESS =
				process.env.NEXT_PUBLIC_USER_REGISTRY_CONTRACT_ADDRESS
			if (!CONTRACT_ADDRESS) {
				throw new Error('Contract address is not defined')
			}
			const contract = new ethers.Contract(
				CONTRACT_ADDRESS,
				UserRegistry.abi,
				signer
			)
			console.log(chainId, account, '<---------Account')
			// const storedUsername = await contract.getUsername(account)
			// console.log(storedUsername);

			// const tx = await contract.registerUser(username, profileHash, {
			// 	gasLimit: 300000,
			// })
			// await tx.wait()
		} catch (error) {
			console.error('Wallet connection error:', error)
		}
	}

	// Function to sign a message
	const signMessage = async (): Promise<void> => {
		if (!window.ethereum) {
			alert('MetaMask is not installed!')
			return
		}

		try {
			const provider = new ethers.BrowserProvider(window.ethereum)
			const signer = await provider.getSigner()
			const signature = await signer.signMessage(message)
			setSignature(signature)

			// Send to backend for verification (optional)
			// const response: Response = await fetch('../api/verify-signature', {
			// 	method: 'POST',
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 	},
			// 	body: JSON.stringify({ message, signature, address }),
			// })

			// // Check if response is OK before parsing JSON
			// if (!response.ok) {
			// 	throw new Error(`Server error: ${response.statusText}`)
			// }

			// const result = await response.json()

			// // Update verification status based on response
			// if (result.success) {
			// 	setVerificationStatus('Signature verified successfully')
			// } else {
			// 	setVerificationStatus('Signature verification failed')
			// }
		} catch (error) {
			console.error('Error verifying signature:', error)
			setVerificationStatus('Error verifying signature')
		}
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen py-2 gap-4'>
			<div className='max-w-2xl mx-auto flex justify-between items-center'>
				<button
					onClick={isConnected ? disconnect : connect}
					className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors'
				>
					{isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
				</button>
			</div>
			{address && <p>Connected Address: {address}</p>}

			{signature ? (
				<p>Signature: {signature}</p>
			) : (
				<div className='max-w-2xl mx-auto flex justify-between items-center'>
					<button
						className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors'
						onClick={signMessage}
					>
						Sign Message
					</button>
				</div>
			)}
			{account && (
				<div className='p-4 bg-gray-100 rounded-lg'>
					<p>Account: {account}</p>
				</div>
			)}
			{verificationStatus && <p>{verificationStatus}</p>}
			<div className='p-4 bg-gray-100 rounded-lg'>
				<p>
					Connection Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
				</p>
			</div>
		</div>
	)
}

// export default function Home() {
// 	const { account, isConnected, chainId } = useWeb3()
// 	const [username, setUsername] = useState('')
// 	const [isUsernameSet, setIsUsernameSet] = useState(false)

// 	useEffect(() => {
// 		const fetchUsername = async () => {
// 			if (!account || !username) {
// 				return
// 			}

// 			console.log('Current account:', account)

// 			const provider = new ethers.BrowserProvider(window.ethereum)
// 			const signer = await provider.getSigner()
// 			const CONTRACT_ADDRESS =
// 				process.env.NEXT_PUBLIC_USER_REGISTRY_CONTRACT_ADDRESS
// 			console.log('Contract Address', CONTRACT_ADDRESS)

// 			if (!CONTRACT_ADDRESS) {
// 				throw new Error('Contract address is not defined')
// 			}
// 			const contract = new ethers.Contract(
// 				CONTRACT_ADDRESS,
// 				UserRegistry.abi,
// 				signer
// 			)

// 			try {
// 				const storedUsername = await contract.getUsername(account)
// 				if (storedUsername) {
// 					setUsername(storedUsername)
// 					setIsUsernameSet(true)
// 				}
// 			} catch (error) {
// 				console.error('Error fetching username:', error)
// 				alert('Failed to fetch username: ' + (error as any).message)
// 			}
// 		}

// 		fetchUsername()
// 	}, [account])

// 	const handleAuth = async () => {
// 		if (!account || !username) return

// 		try {
// 			const provider = new ethers.BrowserProvider(window.ethereum)
// 			const signer = await provider.getSigner()
// 			const address = await signer.getAddress()
// 			console.log(address, '<--------Address')

// 			const nonce = await provider.getTransactionCount(address)
// 			console.log(nonce, '<------- Transaction Count')

// const CONTRACT_ADDRESS =
// 	process.env.NEXT_PUBLIC_USER_REGISTRY_CONTRACT_ADDRESS
// if (!CONTRACT_ADDRESS) {
// 	throw new Error('Contract address is not defined')
// }
// const contract = new ethers.Contract(
// 	CONTRACT_ADDRESS,
// 	UserRegistry.abi,
// 	signer
// )
// const profileHash = ''
// console.log('Username:', username)
// console.log('Profile Hash:', profileHash)
// const tx = await contract.registerUser(username, profileHash, {
// 	gasLimit: 300000,
// })
// await tx.wait()
// 			alert('Username set successfully!')
// 			setIsUsernameSet(true)
// 		} catch (error) {
// 			console.error('Error:', error)
// 			alert('Operation failed: ' + (error as any).message)
// 		}
// 	}

// 	return (
// 		<main className='min-h-screen p-8'>
// 			<div className='max-w-2xl mx-auto'>
// 				<h1 className='text-3xl font-bold mb-8'>Web3 Connection Test</h1>

// 				<div className='space-y-4'>
// 					{/* Connection Status */}
// <div className='p-4 bg-gray-100 rounded-lg'>
// 	<p>
// 		Connection Status:{' '}
// 		{isConnected ? '🟢 Connected' : '🔴 Disconnected'}
// 	</p>
// </div>

// 					{/* Account Info */}
// {account && (
// 	<div className='p-4 bg-gray-100 rounded-lg'>
// 		<p>Account: {account}</p>
// 	</div>
// )}

// 					{/* Network Info */}
// 					{chainId && (
// 						<div className='p-4 bg-gray-100 rounded-lg'>
// 							<p>Chain ID: {chainId.toString()}</p>
// 							<p>
// 								Network:{' '}
// 								{chainId === 1n
// 									? 'Ethereum Mainnet'
// 									: chainId === 5n
// 									? 'Goerli Testnet'
// 									: chainId === 11155111n
// 									? 'Sepolia Testnet'
// 									: chainId === 31337n
// 									? 'Local Network'
// 									: 'Unknown Network'}
// 							</p>
// 						</div>
// 					)}

// 					{/* Display the username if set */}
// 					{isUsernameSet ? (
// 						<div className='p-4 bg-gray-100 rounded-lg'>
// 							<p>Your Username: {username}</p>
// 						</div>
// 					) : (
// 						isConnected && ( // Only show this if connected
// 							<div className='p-4 bg-gray-100 rounded-lg'>
// 								<h2>Set Your Username</h2>
// 								<input
// 									type='text'
// 									value={username}
// 									onChange={e => setUsername(e.target.value)}
// 									placeholder='Enter username'
// 									className='border p-2 rounded w-full'
// 								/>
// 								<button
// 									onClick={handleAuth}
// 									className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors mt-2'
// 								>
// 									Set Username
// 								</button>
// 							</div>
// 						)
// 					)}
// 				</div>
// 			</div>
// 		</main>
// 	)
// }
