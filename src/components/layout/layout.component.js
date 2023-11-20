export class Layout {

	// принимаем пропсы из компонента router через деструктуризацию
	constructor({ router, children }) {
		this.router = router
		this.children = children
	}

	render() {
		const headerHTML = 
		`<header>
			Header
			<nav>
				<a href="/">Home</a>
				<a href="/auth">Auth</a>
				<a href="/about-us">AboutUs</a>
			</nav>
		</header>`

		return `
			${headerHTML}
			<main>
				${this.children}
			</main>
		`
	}
}