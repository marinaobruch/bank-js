import { $R } from "../query/query.lib"
import styles from "@/components/layout/notification/notification.module.scss"

/**
 * NotificationService is a utility class to handle displaying notifications.
 * It can be used to display messages with different types (success, error) and manage the notification timeout.
 */
export class NotificationService {
  #timeout
  constructor(){
    this.#timeout = null
  }

  // фукнционал всплытия уведомлений, сначала, если оно есть, то отчищаем setTimeout, далее в коллбек придет элемент и таймер
  #setTimeout(callback, duration) {
    if(this.#timeout) {
      clearTimeout(this.#timeout)
    }
    this.#timeout = setTimeout(callback, duration)
  }

  /**
	 * Show a notification with a specified message and type.
	 * The notification will automatically hide after a specified duration.
	 * @param {string} message - The message to be displayed in the notification.
	 * @param {('success'|'error')} type - The type of the notification, only 'success' or 'error' are accepted.
	 */
  show(type, message) {
    // проверка, если тип не соответствует success или error, то выведем сообщение об ошибке
    if (!['success', 'error'].includes(type)) {
			throw new Error(
				'Invalid notification type. Allowed types are "success" and "error".'
			)
		}

    // формируем объекты класса стилей: success или error
    const classNames = {
      success: styles.success,
      error: styles.error
    }

    // поиск элемента
		const notificationElement = $R('#notification')
    // указываем класс с учетом того, какой тип переменой нам придет
		const className = classNames[type]

		notificationElement.text(message).addClass(className)

    this.#setTimeout(() => {
			notificationElement.removeClass(className)
		}, 3000)
  }
}