'use client'

import Link from 'next/link'
import styles from './navbar.module.css'

const Navbar = () => {
	return (
		<nav className={styles.navbar}>
			<div className={styles.logo}>
				<Link href='/'>MyApp</Link>
			</div>
		</nav>
	)
}

export default Navbar
