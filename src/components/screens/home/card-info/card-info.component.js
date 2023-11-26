import ChildComponent from '@/core/component/child.component'
import renderService from '@/core/services/render.service'

import styles from './card-info.module.scss'
import template from './card-info.template.html'
import { CardService } from '@/api/card.service'
import { Store } from '@/core/store/store'
import { $R } from '@/core/query/query.lib'
import { formatCardNumber } from '@/utils/format/format-card-number'
import { formatToCurrency } from '@/utils/format/format-to-currency'

const CODE = '*****'
export class CardInfo extends ChildComponent {

	constructor() {
		super()

		this.store = Store.getInstance()
		this.cardService = new CardService()

		this.element = renderService.htmlToElement(template, [], styles)
	}

	#copyCardNumber(e) {
		navigator.clipboard.writeText(e.target.innerText).then(() => {
			e.target.innerText = 'Card number copied!'
			setTimeout(() => {
				e.target.innerText = formatCardNumber(this.card.number)
			}, 2000)
		})
	}

	#toggleCvc(cardCvcElement) {
		const text = cardCvcElement.text()
		text === CODE
			? cardCvcElement.text(this.card.cvc)
			: cardCvcElement.text(CODE)
	}

	fillElements() {
		$R(this.element).html(
			renderService.htmlToElement(template, [], styles).innerHTML
		)

		$R(this.element)
			// обращаемся ко всем первым div-ам на первом уровне
			.findAll(':scope > div')
			.forEach(child => {
				child.addClass('fade-in')
			})

			// инфо по карте, добавляем стили и опцию копирования при клике
		$R(this.element)
			.find('#card-number')
			.text(formatCardNumber(this.card.number))
			.click(this.#copyCardNumber.bind(this))

			// добавляем дату окончания
		$R(this.element).find('#card-expire-date').text(this.card.expireDate)

		const cardCvcElement = $R(this.element).find('#card-cvc')
		cardCvcElement.text(CODE).css('width', '44px')

		// элемент cvc, при клике работает toggle - показ/скрытие
		$R(this.element)
			.find('#toggle-cvc')
			.click(this.#toggleCvc.bind(this, cardCvcElement))

			// добавляем баланс с форматированием цифр
		$R(this.element)
			.find('#card-balance')
			.text(formatToCurrency(this.card.balance))
	}

	// делаем запрос на получение юзера и запускаем метод fillElements и добавляем в стор данные
	fetchData() {
		this.cardService.byUser(data => {
			if (data?.id) {
				this.card = data
				this.fillElements()
				this.store.updateCard(data)
			} else {
				this.store.updateCard(null)
			}
		})
	}

	render() {
		if (this.store.state.user) this.fetchData()
		
		return this.element;
	}
}