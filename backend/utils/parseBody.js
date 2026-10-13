// Runs a zod schema against a request body.
// Returns { data } on success, or { error } holding the joined issue messages.
export const parseBody = (schema, body) => {
    const result = schema.safeParse(body);

    if (!result.success) {
        const error =
            result.error.issues?.map((err) => err.message).join(", ") ||
            "Validation failed";

        return { error };
    }

    return { data: result.data };
};
