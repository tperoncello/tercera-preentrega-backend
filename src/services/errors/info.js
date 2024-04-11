export const generateErrorInfo = user  => {
    const email = user ? user.email : 'undefined';
    return `
        Una o mas campos estan incompletas o no son validos.
        Lista de propiedades obligatorias:
        - email: Debe estar Completo. (${email})
        - pasword: Debe estar Completo. `
}