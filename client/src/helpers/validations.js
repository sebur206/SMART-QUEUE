export const validateForm = (formData, rules) => {
    const errors = {};

    for (const field in rules) {
        const value = formData[field];
        const checks = rules[field];
        const stringValue =
            value !== undefined && value !== null ? String(value).trim() : "";

        for (const check of checks) {
            if (check.type === "required") {
                if (stringValue === "") {
                    errors[field] = check.message || `${field} is required`;
                    break;
                }
                continue;
            }

            if (stringValue === "") {
                break;
            }

            if (check.type === "email" && !/\S+@\S+\.\S+/.test(stringValue)) {
                errors[field] = check.message || "Invalid email format";
                break;
            }

            if (check.type === "minLength" && stringValue.length < check.value) {
                errors[field] =
                    check.message ||
                    `${field} must be at least ${check.value} characters`;
                break;
            }

            if (check.type === "pattern" && !check.value.test(stringValue)) {
                errors[field] = check.message || `${field} format is invalid`;
                break;
            }
        }
    }

    return errors;
};
