import {ref} from "vue";
import {Base64} from "js-base64";

export default function useRememberLoginInfo() {
    const loginInfo = ref({
        username: "",
        password: "",
        remember: false
    })

    const loginInfoJson = localStorage.getItem("loginInfo")

    if (loginInfoJson) {
        const {username, password, remember} = JSON.parse(loginInfoJson)
        loginInfo.value = {username, password: Base64.decode(password), remember}
    }

    function saveLoginInfo() {
        loginInfo.value.password = Base64.encode(loginInfo.value.password)
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo.value))
    }

    function removeLoginInfo() {
        localStorage.removeItem("loginInfo")
    }

    return {loginInfo, saveLoginInfo, removeLoginInfo}
}
