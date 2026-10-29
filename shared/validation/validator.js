export class Validator {
    static validatePassword(password) {
        const errors = [];

        if (typeof password !== 'string') {
            return { valid: false, errors: ['A senha deve ser uma cadeia de caraceteres'] };
        }

        if (password.length < 8 || password.length > 128) {
            errors.push('A senha deve conter entre 8 e 128 caracteres');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('A senha deve conter ao menos uma letra maiúscula');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('A senha deve conter ao menos uma letra minúscula');
        }
        if (!/[0-9]/.test(password)) {
            errors.push('A senha deve conter ao menos um número');
        }
        if (!/[!@#$&*]/.test(password)) {
            errors.push('A senha deve conter ao menos um caractere especial (!, @, #, $, &, *)');
        }

        return { valid: errors.length === 0, errors };
    }
}
