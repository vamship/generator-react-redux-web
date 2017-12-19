/**
 * Helper routines for client side validations.
 */
export default {
    /**
     * Validates the format of the specified email address.
     *
     * @param {String} email The email address to validate.
     *
     * @return {String} An error message if the validation fails, an empty
     *         string if the validation succeeds.
     */
    validateEmail: function(email) {
        if (typeof email !== 'string' || email.length <= 0) {
            return 'Email address cannot be empty';
        } else if (!email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/)) {
            return 'Invalid email address';
        }
        return '';
    },

    /**
     * Validates the format of the specified phone number.
     *
     * @param {String} phoneNumber The phone number to validate.
     * @param {Boolean} [isOptional=false] An optional boolean parameter that
     *        will allow the phone number to be empty
     *
     * @return {String} An error message if the validation fails, an empty
     *         string if the validation succeeds.
     */
    validatePhoneNumber: function(phoneNumber, isOptional) {
        if (typeof phoneNumber !== 'string' || phoneNumber.length <= 0) {
            if (!isOptional) {
                return 'Phone number cannot be empty';
            }
            return '';
        } else if (!phoneNumber.match(/^\+[0-9]{11,15}$/)) {
            return 'Must start with +<country code> and only include numbers';
        }
        return '';
    },

    /**
     * Validates that the specified field is not empty
     *
     * @param {String} value The value to validate
     * @param {String} [fieldName='This field'] An optional field name to use
     *        in the error message.
     *
     * @return {String} An error message if the validation fails, an empty
     *         string if the validation succeeds.
     */
    validateRequiredString: function(value, fieldName) {
        fieldName = fieldName || 'This field';
        if (typeof value !== 'string' || value.length <= 0) {
            return `${fieldName} cannot be empty`;
        }
        return '';
    },

    /**
     * Validates the format of the specified password.
     *
     * @param {String} password The password to validate.
     * @param {Boolean} [skipPolicyCheck=false] An optional boolean parameter
     *        that when set, requests that password policy checks are skipped.
     *
     * @return {String} An error message if the validation fails, an empty
     *         string if the validation succeeds.
     */
    validatePassword: function(password, skipPolicyCheck) {
        if (typeof password !== 'string' || password.length <= 0) {
            return 'Password cannot be empty';
        } else if (!skipPolicyCheck) {
            if (password.length < 8) {
                return 'Password must be at least 8 characters';
            }
            if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&])[^ ]{8,}$/)) {
                return 'Password must contain [a-z], [A-Z], [0-9] and one of [!@#$%^&]';
            }
        }
        return '';
    }
};
