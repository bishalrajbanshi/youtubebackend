class ApiError extends Error {
    constructor(options) {
        const {
            statusCode = 500,
            message = "Something went wrong",
            errors = [],
            stack = ""
        } = typeof options === 'object' ? options : {
            statusCode: options,
            message: arguments[1],
            errors: arguments[2],
            stack: arguments[3]
        };

        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.message = message;
        this.success = false;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;