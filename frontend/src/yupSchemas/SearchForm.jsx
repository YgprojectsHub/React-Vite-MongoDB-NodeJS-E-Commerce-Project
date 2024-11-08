import * as yup from "yup"

export const searchFormSchemas = yup.object().shape({
    search : yup.string(),
})