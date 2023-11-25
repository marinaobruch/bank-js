import renderService from "@/core/services/render.service"

import styles from './layout.module.scss'
import template from "./layout.template.html"
import { $R } from "@/core/query/query.lib"
import { Header } from "./header/header.component"
import ChildComponent from "@/core/component/child.component"
export class Layout extends ChildComponent {
	// принимаем пропсы из компонента router через деструктуризацию
	constructor({ router, children }) {
		super()
		
		this.router = router
		this.children = children
	}

	render() {
		this.element = renderService.htmlToElement(template, [], styles)

		// ищем main блок (типа контейнера)
		const mainElement = $R(this.element).find("main")

		// ищем content блок (в html layout)
		const contentContainer = $R(this.element).find("#content")
		// добавляем приходящий сюда children, но далее его нужно будет добавить
		contentContainer.append(this.children)


		// с помощью append добавляем этот элемент, а с помощью before "закидываем" его выше блока main
		mainElement
		.before(new Header({router: this.router}).render())
		.append(contentContainer.element)

		return this.element
	}
}