import {ref} from "vue";
import {Base64} from "js-base64";

export default function useRememberLoginInfo() {
    const rememberLoginInfo = ref<boolean>(false)
    const loginInfo = ref({
        username: "",
        password: ""
    })

    const loginInfoJson = localStorage.getItem("loginInfo")
    if (loginInfoJson) {
        const {username, password} = JSON.parse(loginInfoJson)
        loginInfo.value = {username, password: Base64.decode(password)}
        rememberLoginInfo.value = true
    }

    function saveLoginInfo() {
        loginInfo.value.password = Base64.encode(loginInfo.value.password)
        localStorage.setItem("loginInfo", JSON.stringify(loginInfo))
    }

    function removeLoginInfo() {
        localStorage.removeItem("loginInfo")
    }

    return {loginInfo, rememberLoginInfo, saveLoginInfo, removeLoginInfo}
}
