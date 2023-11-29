import ChildComponent from '@/core/component/child.component'
import renderService from '@/core/services/render.service'

import styles from './actions.module.scss'
import template from './actions.template.html'

import { CardService } from '@/api/card.service'
import { NotificationService } from '@/core/services/notification.service'
import { Field } from '@/components/ui/field/field.component'
import { Button } from '@/components/ui/button/button.component'
import { $R } from '@/core/query/query.lib'
import { Store } from '@/core/store/store'
import validationService from '@/core/services/validation.service'
import { BALANCE_UPDATED } from '@/constants/event.constants'

export class Actions extends ChildComponent {

	constructor() {
		super()

		this.store = Store.getInstance().state
		this.cardService = new CardService()
		this.notificationService = new NotificationService()
	}

		/**
	 * @param {Event} event - The event object from the button click event.
	 * @param {'top-up' | 'withdrawal'} type - The type of the transaction, either "top-up" or "withdrawal".
	 */
		updateBalance(event, type) {
			event.preventDefault()
	
			// чек, что юзер должен быть авторизован
			if (!this.store.user) {
				this.notificationService.show('error', 'You need authorization!')
			}
	
			$R(event.target).text('Sending...').attr('disabled', true)
	
			// получаем значение суммы перевода из input-а
			const inputElement = $R(this.element).find('input')
			const amount = inputElement.value()
	
			// валидация, если сумма не введена, то красная рамка
			if (!amount) {
				validationService.showError($R(this.element).find('label'))
				return
			}
	
			// запрос к серверу: amount - сумма перевода, type - снятие/пополнение
			this.cardService.updateBalance(amount, type, () => {
				inputElement.value('')

				// balanceUpdatedEvent - новое кастомное событие, которое записали в переменную
				const balanceUpdatedEvent = new Event(BALANCE_UPDATED)
				// dispatchEvent - вызов кастомного события (balanceUpdatedEvent), необходимо для реактивности, чтобы в других элементах приходило обновление, оповещение о том, что были изменения
				document.dispatchEvent(balanceUpdatedEvent)
			})
	
			$R(event.target).removeAttr('disabled').text(type)
		}

	render() {
		this.element = renderService.htmlToElement(template, [
			new Field({
				placeholder: 'amount',
				name: 'Enter amount:',
				type: 'number'
			})
		], styles)

		$R(this.element)
		.find('#action-buttons')
		.append(
			new Button({
				children: 'Top-up',
				variant: 'green',
				onClick: e => this.updateBalance(e, 'top-up')
			}).render()
		)
		.append(
			new Button({
				children: 'Withdrawal',
				variant: 'purple',
				onClick: e => this.updateBalance(e, 'withdrawal')
			}).render()
		)
		
		return this.element;
	}
}