export const validPassword = (password) => {
    const pass = /^(?=.*\d)(?=.*[A-Z]).{7,}$/
    return pass.test(password);
}


export const validEmail = (email) => {
    const pass = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pass.test(email);
};