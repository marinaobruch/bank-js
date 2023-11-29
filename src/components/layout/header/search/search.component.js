import ChildComponent from '@/core/component/child.component'
import { $R } from '@/core/query/query.lib';
import renderService from '@/core/services/render.service'

import styles from './search.module.scss'
import template from './search.template.html'

import { UserService } from '@/api/user.service';
import { UserItem } from '@/components/ui/user-item/user-item.component';
import { debounce } from '@/utils/debounce.util';
import { TRANSFER_FIELD_SELECTOR } from '@/components/screens/home/contacts/transfer-field/transfer-field.component';
import { formatCardNumberWithDashes } from '@/utils/format/format-card-number';

export class Search extends ChildComponent {
	constructor() {
		super()
		this.userService = new UserService()
	}

	// делаем стрелочную, чтобы у нас не терялся контекст
	 #handleSearch = async event => {

		// значение из поискового запроса
		const searchTerm = event.target.value
		// компонент, где лежат все результаты поиска
		const searchResultElement = $R(this.element).find("#search-results")

		// если в поле ввода ничего нет, то и компонент полностью отчищается
		if(!searchTerm)
		searchResultElement.html("")

		await this.userService.getAll(searchTerm, users => {
			searchResultElement.html('')

			// делаем цикл, на каждой итерации создаем экземпляр с стилями и анимацией
			users.forEach((user, index) => {
				const userItem = new UserItem(user, true, () => {
					$R(TRANSFER_FIELD_SELECTOR).value(
						formatCardNumberWithDashes(user.card.number)
					)

					searchResultElement.html('')
				}).render()

				$R(userItem)
					.addClass(styles.item)
					.css('transition-delay', `${index * 0.1}s`)

				// после добавления стилей append-им юзера в поле с результатами
				searchResultElement.append(userItem)

				setTimeout(() => {
					$R(userItem).addClass(styles.visible)
				}, 50)
			})
		})
	}


	render() {
		this.element = renderService.htmlToElement(template, [], styles);

		const debouncedHandleSearch = debounce(this.#handleSearch, 300)

		$R(this.element).find('input').input({
			type: 'search',
			name: 'search',
			placeholder: 'Search contacts...'
		}).on('input', debouncedHandleSearch)

		
		return this.element;
	}
}