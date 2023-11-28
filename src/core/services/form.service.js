class FormService {
	/**
	 * Retrieves the values of input elements within a form element.
	 * @param {HTMLFormElement} formElement - The form element containing input elements.
	 * @returns {object} An object containing the input element's name as the key and its value as the value.
	 */
  // получаем элемент самой формы form
	getFormValues(formElement) {
    // внутри формы ищем все input-ы
		const inputs = formElement.querySelectorAll('input')
		const values = {}

    // объект values наполняем ключами и значениями
    // ключ равен имени текущего инпута, а значением будет являться его значение
		for (const input of inputs) {
			values[input.name] = input.value
		}

		return values
	}
}

export default new FormService()