class apiError extends Error {
    constructor(options) {
        const {
            statusCode = 500,
            message = "Something went wrong",
            errors = [],
            data = null,
            stack = null
        } = options;

        super(message); 
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = data;  
        this.message = message;
        this.success = false; 

        // Capture stack trace if it's provided, otherwise generate one
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default apiError;
