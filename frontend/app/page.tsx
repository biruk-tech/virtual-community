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

// import Web3 from 'web3';

// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// const contractAddress = '0x...';
// const contractAbi = [...];

// const contract = new web3.eth.Contract(contractAbi, contractAddress);

export default function Home() {
	const { account, connect, disconnect, isConnected, chainId, provider } =
		useWeb3()
	const [address, setAddress] = useState<string>('')
	const [signature, setSignature] = useState<string>('')
	const [message, setMessage] = useState<string>(
		'Welcome to Virtual Ethiopia! Please sign this message to verify your identity.'
	)
	const [verificationStatus, setVerificationStatus] = useState<string | null>(
		null
	)

	const [contract, setContract] = useState<any>(null)
	const [balance, setBalance] = useState<string>('')

	useEffect(() => {
		async function isAuthenticated() {
			try {
				console.log(account, '<-----account')
				const provider = new ethers.BrowserProvider(window.ethereum)
				const signer = await provider.getSigner()
				const address = await signer.getAddress()
				setAddress(address)
				console.log(address, '<------- Address')

				const nonce = await provider.getTransactionCount(address)
				console.log(nonce, '<------- Transaction Count')

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

				const getData = async () => {
					const data = await contract['getAllUsers']()
					return data
				}
				console.log(getData(), '<------- Data')
				console.log(contract, '<--------Contract')
				// if (!signature) {
				// 	const signature = await signer.signMessage(message)
				// 	setSignature(signature)
				// }
				// setMessage(
				// 	'Thank you for verifying your identity and being part of our community!'
				// )
			} catch (error) {
				console.error('Error:', error)
				alert('Operation failed: ' + (error as any).message)
			}
		}
		isAuthenticated()
	}, [])

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
			const balance = await provider.getBalance(address)
			console.log('Available balance:', balance.toString())
			const balanceInEth = ethers.formatEther(balance)
			console.log(balanceInEth.toString()) // Output: 0.123456789 (ETH
			setBalance(balanceInEth.toString())

			const getData = async () => {
				let data
				if (!contract) {
					console.error('Contract is not initialized')
					return
				}
				try {
					data = await contract['getAllUsers']().call()
					console.log('Data:-------->', data)
					return data
				} catch (error) {
					console.error('Error:', error)
				}
				return data
			}
			getData().then(data => console.log('Data:', data))

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
			{account && (
				<div className='p-4 bg-gray-100 rounded-lg'>
					<p>Account: {account}</p>
				</div>
			)}
			{signature && isConnected ? (
				<div>
					<p>Signature: {signature}</p>
					<p>Available Balance: {balance} ETH</p>
				</div>
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
			{address && isConnected && <p>Connected Address: {address}</p>}
			{verificationStatus && <p>{verificationStatus}</p>}
			<div className='p-4 bg-gray-100 rounded-lg'>
				<p>
					Connection Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
				</p>
			</div>
		</div>
	)
}
