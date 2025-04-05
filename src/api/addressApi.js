import { fetch } from "./Fetch"

export const addAddress =async (content) => {
    let data  = await fetch.post("/address/add",content)
    return data.data
}

