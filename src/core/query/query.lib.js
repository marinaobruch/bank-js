// $R('#rrt').find('.rge').css('', '').text('').html('')
// пример, как будет выглядеть запрос извне: $R(element).find("h1").css("color", "green")

import { formatCardNumberWithDashes } from "@/utils/format/format-card-number"

/**
 * Represents the RQuery class for working with DOM elements.
 */
class RQuery {
	/**
	 * Create a new RQuery instance.
	 * @param {string|HTMLElement} selector - A CSS selector string or an HTMLElement.
	 */
	constructor(selector) {
		if (typeof selector === 'string') {
            // назначаем element именно в классе RQuery
			this.element = document.querySelector(selector)

			if (!this.element) {
				throw new Error(`Element ${selector} not found!`)
	        }
        // тк передавать мы будем либо строку (описали условия для нее выше). либо элемент (например, как со странички Home: const element = renderService.htmlToElement(template, [], styles))
		} else if (selector instanceof HTMLElement) {
			this.element = selector
		} else {
			throw new Error('Invalid selector type')

		}
	}

	/* FIND */

	/**
	 * Find the first element that matches the specified selector within the selected element.
	 * @param {string} selector - A CSS selector string to search for within the selected element.
	 * @returns {RQuery} A new RQuery instance for the found element.
	 */

  // здесь мы идем по цепочке из демо-кода в 1й строке, те ищем элемент из текущего контекста
	find(selector) {
		const element = new RQuery(this.element.querySelector(selector))

		if (element) {
			return element
		} else {
			throw new Error(`Element ${selector} not found!`)
		}
	}

		/* INSERT */

  /**
	 * Append a new element as a child of the selected element.
	 * @param {HTMLElement} childElement - The new child element to append.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
    append(childElement) {
        this.element.appendChild(childElement)
        return this
    }

  /**
	 * Insert a new element before the selected element.
	 * @param {HTMLElement} newElement - The new element to insert before the selected element.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
	before(newElement) {
		if (!(newElement instanceof HTMLElement)) {
			throw new Error('Element must be an HTMLElement')
		}

		const parentElement = this.element.parentElement

		if (parentElement) {
            //insertBefore - JS метод, newElement - новый элемент, который мы хотим вставить перед нашим this.element
			parentElement.insertBefore(newElement, this.element)
			return this
		} else {
			throw new Error('Element does not have a parent element')
		}
	}

  /**
	 * Get or set the inner HTML of the selected element.
	 * @param {string} [htmlContent] - Optional HTML content to set. If not provided, the current inner HTML will be returned.
	 * @returns {RQuery|string} The current RQuery instance for chaining when setting HTML content, or the current inner HTML when getting.
	 */
	html(htmlContent) {
		if (typeof htmlContent === 'undefined') {
			return this.element.innerHTML
		} else {
			this.element.innerHTML = htmlContent
			return this
		}
	}

	/**
	 * Get or set the text content of the selected element.
	 * @param {string} [textContent] - Optional text content to set. If not provided, the current text content will be returned.
	 * @returns {RQuery|string} The current RQuery instance for chaining when setting text content, or the current text content when getting.
	 */
		text(textContent) {
			if (typeof textContent === 'undefined') {
				return this.element.textContent
			} else {
				this.element.textContent = textContent
				return this
			}
		}

		/* EVENTS */

	/**
	 * Attach a click event listener to the selected element.
	 * @param {function(Event): void} callback - The event listener function to execute when the selected element is clicked. The function will receive the event object as its argument.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
		click(callback) {
			this.element.addEventListener('click', callback)
			return this
		}

		/* FORM */

		/**
	 * Set an event listener for the submit event of a form element.
	 * @param {function(Event): void} onSubmit - The event listener for the form's submit event.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
	submit(onSubmit) {
		if (this.element.tagName.toLowerCase() === 'form') {
			this.element.addEventListener('submit', e => {
				e.preventDefault()
				onSubmit(e)
			})
		} else {
			throw new Error('Element must be a form')
		}

		return this
	}

	/**
	 * Set attributes and event listeners for an input element.
	 * @param {object} options - An object containing input options.
	 * @param {function(Event): void} [options.onInput] - The event listener for the input's input event.
	 * @param {object} [options.rest] - Optional attributes to set on the input element.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
	// получаем все опции для поля ввода, в т.ч. получаем отдельно onInput, чтобы повешать на него слушатель
	input({ onInput, ...rest }) {
		if (this.element.tagName.toLowerCase() !== 'input')
			throw new Error('Element must be an input')

		for (const [key, value] of Object.entries(rest)) {
			this.element.setAttribute(key, value)
		}

		if (onInput) {
			this.element.addEventListener('input', onInput)
		}

		return this
	}

	/**
	 * Set attributes and event listeners for a number input element.
	 * @param {number} [limit] - The maximum length of input value.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
	numberInput(limit) {
		if (
			this.element.tagName.toLowerCase() !== 'input' || this.element.type !== 'number'
		)
			throw new Error('Element must be an input with type "number"')

		this.element.addEventListener('input', event => {
			// event.target.value - получаем текущее значение из поля, в которое что-то ввели,
			// далее все цифры 0-9 (g - глобально) заменяем на пустоту, те не должно быть НЕ чисел
			let value = event.target.value.replace(/[^0-9]/g, '')
			if (limit) value = value.substring(0, limit)
			event.target.value = value
		})

		return this
	}

	/**
	 * Set attributes and event listeners for a credit card input element.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
	creditCardInput() {
		const limit = 16

		if (
			this.element.tagName.toLowerCase() !== 'input' || this.element.type !== 'text'
		)
			throw new Error('Element must be an input with type "text"')

		this.element.addEventListener('input', event => {
			let value = event.target.value.replace(/[^0-9]/g, '')
			if (limit) value = value.substring(0, limit)
			event.target.value = formatCardNumberWithDashes(value)
		})

		return this
	}

			/* STYLES */

	/**
	 * Set the CSS style of the selected element.
	 * @param {string} property - The CSS property to set.
	 * @param {string} value - The value to set for the CSS property.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
	css(property, value) {
		if (typeof property !== 'string' || typeof value !== 'string') {
			throw new Error('property and value must be strings')
		}

        // по умолчанию в js стили меняем как: this.element.style.color = "red", тут вместо "color = "red" наш кастомный стиль
		this.element.style[property] = value
        // здесь отдаем именно this, чтобы можно было далее продолжать цепочку
		return this
	}

	/**
	 * Adds a class or a list of classes to the current element.
	 * @param {string | string[]} classNames - A single class name or an array of class names to add to the element.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
	addClass(classNames) {
		// проверка на массив Array - глобальный, isArray - метод
		if (Array.isArray(classNames)) {
			for (const className of classNames) {
				this.element.classList.add(className)
			}
		} else {
			this.element.classList.add(classNames)
		}

		return this
	}

	/**
	 * Removes a class or a list of classes from the current element.
	 * @param {string | string[]} classNames - A single class name or an array of class names to remove from the element.
	 * @returns {RQuery} The current RQuery instance for chaining.
	 */
	removeClass(classNames) {
		if (Array.isArray(classNames)) {
			for (const className of classNames) {
				this.element.classList.remove(className)
			}
		} else {
			this.element.classList.remove(classNames)
		}

		return this
	}

	/**
	 * Set or get the value of an attribute on the selected element.
	 * @param {string} attributeName - The name of the attribute to set or get.
	 * @param {string} [value] - The value to set for the attribute. If not provided, the current value of the attribute will be returned.
	 * @returns {RQuery|string} The current RQuery instance for chaining (if setting) or the attribute value (if getting).
	 */
		attr(attributeName, value) {
			if (typeof attributeName !== 'string') {
				throw new Error('Attribute name must be a string')
			}
	
			if (typeof value === 'undefined') {
				return this.element.getAttribute(attributeName)
			} else {
				this.element.setAttribute(attributeName, value)
				return this
			}
		}
}

/**
 * Create a new RQuery instance for the given selector.
 * @param {string|HTMLElement} selector - A CSS selector string or an HTMLElement.
 * @returns {RQuery} A new RQuery instance for the given selector.
 */
export function $R(selector) {
	return new RQuery(selector)
}