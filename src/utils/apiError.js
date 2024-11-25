class apiError extends Error{

    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        stack = ""
    ){
        //overide
        super(message)
        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.success = this.success,
        this.errors = errors

        if (this.stack) {
            this.stack = this.stack
        }else{
           Error.captureStackTrace(this, this.constructor) 
        }
    }

}

export { apiError }