import ChildComponent from "../component/child.component"

class RenderService {
    /**
	 * @param {string} html
	 * @param {Array} components
	 * @param {Object} [styles]
	 * @returns {HTMLElement}
	 */
    htmlToElement(html, components = [], styles) {
        // тег template по сути представляет собой обертку (пустой тег) для будушего кода html
        const template = document.createElement("template")
        // далее в template заносит наш html код, который приходит извне как пропс
        template.innerHTML = html.trim()

        // здесь избавляемся от обертки template, забирая у нее первый Child элемент, что является html элементом (не строка)
        const element = template.content.firstChild
        // метод будет принимать element, с которым нужно работать и в которым будем всё вкладывать, и components, которые будут задействованы в этом компоненте
        this.#replaceComponentTags(element, components)

        return element
    }

    /**
	 * @param {HTMLElement} parentElement
	 * @param {Array} components
	 */

    // здесь логика по работе с компонентными тегами типа <component-card></component-card>, мы будем их искать из всех компонентов []
    // 
    #replaceComponentTags(parentElement, components) {
        // регулярное выражение, ^ - начало строки нашего компонента, до "-"
        const componentTagPattern = /^component-/
        // ищем все элементы у переданного через пропс parentElement
        const allElements = parentElement.getElementsByTagName("*")

        // проверка того, является ли найденный элемент компонентом, заданным выше в паттерне
        for (const element of allElements) {
            const elementTagName = element.tagName.toLowerCase()

            if (componentTagPattern.test(elementTagName)) {
                // отчищаем имя тега от "component-", чтобы далее мы могли сравнить имя класса и имя тега
                const componentName = elementTagName
                .replace(componentTagPattern, "")
                .replace(/-/g, "")

                // ищем из всех переданных компонентов текущий элемент, который будет отрисовываться
                const foundComponent = components.find(Component => {
                    // проверка для того, является ли компонент динамическим(вызван как new heading("Title"))
                    // т.е. если ранее экземпляр уже развернули, оставляем его: (Component), если нет то создаем: new Component()
                    const instance = Component instanceof ChildComponent ? Component: new Component()
                    // constructor.name - название класса (Home / Auth ...)
                    return instance.constructor.name.toLowerCase() === componentName
                })

                if(foundComponent) {
                    // если является инстанс то, рендерим его, если нет, то создаем экземпляр, а потом делаем рендер
                    const componentContent = foundComponent instanceof ChildComponent
                    ? foundComponent.render()
                    : new foundComponent().render()

                // заменяем элемент на готовый компонент
                element.replaceWith(componentContent)
                } else {
                    console.error(
                        `Component "${componentName}" not found in the provided components array`
                    );
                }
            }
        }
    }
}

export default new RenderService()