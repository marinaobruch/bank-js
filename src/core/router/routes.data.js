import { AboutUs } from "@/components/screens/about-us/about-us.components";
import { Auth } from "@/components/screens/auth/auth.components";
import { Home } from "@/components/screens/home/home.components";

export const ROUTES = [
    {
        path: "/",
        component: Home
    },
    {
        path: "/auth",
        component: Auth
    },
    {
        path: "/about-us",
        component: AboutUs
    }
]