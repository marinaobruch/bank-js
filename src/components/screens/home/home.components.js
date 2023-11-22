import { BaseScreen } from "@/core/component/base-screen.component";
import renderService from "@/core/services/render.service";
import { $R } from "@/core/query/query.lib";

import styles from './home.module.scss'
import template from "./home.template.html"
import { Button } from "@/components/ui/button/button.component";
export class Home extends BaseScreen {
    constructor() {
        // наследование - используем функцию super, чтобы прокинуть аргумент вовнутрь BaseScreen
        super({ title: "Home" })
    }
    render() {
		const element = renderService.htmlToElement(
            template,
            [
                new Button({
                    children: "Send",
                    onClick: () => alert("Hey"),
                    variant: "green"
        })], styles)

        $R(element).find("h1").css("color", "green")

		return element
    }
}