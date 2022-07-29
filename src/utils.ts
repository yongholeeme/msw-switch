export const makeKey = (method:string, url:string) => `msw_${method.toLowerCase()}_${url}`
