async function main() {
	const Proposal = await ethers.getContractFactory('Proposal')
	let contractAddress

	try {
		const proposal = await Proposal.deploy()
		await proposal.waitForDeployment()
		contractAddress = await proposal.getAddress()
	} catch (error) {
		console.error('Deployment error:', error)
		return
	}

	console.log('Proposal contract deployed to:', contractAddress)
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error)
		process.exit(1)
	})
