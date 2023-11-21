import { NotFound } from "@/components/screens/not-found/not-found.components";
import { Layout } from "@/components/layout/layout.component";

import { ROUTES } from "./routes.data";
import { $R } from "../query/query.lib";

export class Router {
    #routes = ROUTES
    #currentRoute = null
    #layout = null

    // в constructor вызываем все команды, которые запустятся при инициализации этого компонента
    constructor(){
        // для навигации, если мы заходим нажать в браузере вперед/назад
        window.addEventListener("popstate", () => {
            this.#handleRouteChange()
        })

        this.#handleRouteChange()
        this.#handleLinks()
    }

    #handleLinks() {
        document.addEventListener("click", event => {
            // event.target - то, на что мы кликнули в любой области сайта
            // при клике мы ищем и возвращаем ближайщий родительский элемент селектора "а" (те сама ссылка)
            const target = event.target.closest("a")

            if(target) {
                event.preventDefault()
                // передаем путь, по которому хотим перейти
                this.navigate(target.href)
            }
        })
    }

    navigate(path) {
        if(path !== this.getCurrentPath()) {
            window.history.pushState({}, "", path)
            // исходя из текущего пути будет обновление всего контента,
            // а в window мы уже передали новый путь
            this.#handleRouteChange()
        }
    }

    // получение текущего path-url
    getCurrentPath(){
        return window.location.pathname
    }

    // смена (рендер) страницы
    #handleRouteChange(){
        const path = this.getCurrentPath() || "/"
        let route = this.#routes.find(route => route.path === path)

            if(!route) {
            route = {
                component: NotFound
            }
        }

        this.#currentRoute = route
        this.#render()
    }

	#render() {
        // здесь мы возьмем из currentRoute (определили на пред.шаге) ключ component
        // пишем new, тк здесь мы получаем класс (компонент) и нам нужно его здесь раскрыть
        // сразу рендерим записью "component.render()", тк в каждом компоненте есть свое свойство render
		const component = new this.#currentRoute.component().render()

        // запись "router: this" означает, что мы передаем весь класс Router, 
        // и все его методы (кроме приватных) будут доступны для вызова извне

        // проверка если обертки еще нет, то мы ее создаем (при переходе между страницами этот шаг будет пропускаться, тк обертка уже будет инициализирована)
		if (!this.#layout) {
			this.#layout = new Layout({
				router: this,
				children: component
			}).render()

            $R("#app").append(this.#layout)
		} else {
            // здесь мы сначала контент отчищаем html(""), а затем аппендим наш component
            $R("#content").html("").append(component)
		}
	}
}
