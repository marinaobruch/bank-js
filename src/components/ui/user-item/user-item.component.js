import ChildComponent from '@/core/component/child.component'
import renderService from '@/core/services/render.service'

import styles from './user-item.module.scss'
import template from './user-item.template.html'
import { $R } from '@/core/query/query.lib'

export class UserItem extends ChildComponent {
	constructor(user, isGray = false, onClick) {
		super()

		if (!user) throw new Error("User should be passed!")
		if (!user?.name) throw new Error('User must have a "name!"')
		if (!user?.avatarPath) throw new Error('User must have an "avatarPath!"')

		// назначение локальных переменных 
		this.user = user
		this.onClick = onClick
		this.isGray = isGray
	}

	#preventDefault(event) {
		event.preventDefault()
	}

	// метод будет следить за обновлением авторизации
	update(avatarPath, name) {
		if(name && avatarPath)
		$R(this.element).find("img").attr("src", avatarPath).attr("alt", name)
		$R(this.element).find("span").text(name)

	}

	render() {
		this.element = renderService.htmlToElement(template, [], styles);

		this.update(this.user)

		$R(this.element).click(this.onClick || this.#preventDefault.bind(this))

		if (!this.onClick) $R(this.element).attr("disabled", "")
		if (!this.isGray) $R(this.element).addClass(styles.gray)
		
		return this.element;
	}
}