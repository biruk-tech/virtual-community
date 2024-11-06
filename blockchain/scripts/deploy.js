async function main() {
	const Proposal = await ethers.getContractFactory('Proposal')
	const User = await ethers.getContractFactory('UserRegistry')
	let proposalContractAddress, userContractAddress

	try {
		const user = await User.deploy()
		await user.waitForDeployment()
		userContractAddress = await user.getAddress()

		// Proposal deployment
		const proposal = await Proposal.deploy()
		await proposal.waitForDeployment()
		proposalContractAddress = await proposal.getAddress()
	} catch (error) {
		console.error('Deployment error:', error)
		return
	}

	console.log('User contract deployed to:', userContractAddress)

	console.log('Proposal contract deployed to:', proposalContractAddress)
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
