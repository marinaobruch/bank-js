import { BaseScreen } from "@/core/component/base-screen.component";
export class Home extends BaseScreen {
    constructor() {
        // наследование - используем функцию super, чтобы прокинуть аргумент вовнутрь BaseScreen
        super({ title: "Home" })
    }
    render() {
        return "<p>Home</p>"
    }
}