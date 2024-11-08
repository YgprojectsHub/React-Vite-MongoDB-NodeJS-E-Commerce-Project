import { isStartsWith } from "./isStartsWith"

export const whichLayout = () => {
    if(isStartsWith("/p/account")){
        return 1
    }
    else if(isStartsWith("/p/admin")){
        return 2
    }
    else if(isStartsWith("/")){
        return 0
    }
}
