class apiError extends Error{

    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        statck = ""
    ){
        //overide
        super(message)
        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.success = this.success,
        this.errors = errors

        if (statck) {
            this.stack = statck
        }else{
           Error.captureStackTrace(this, this.constructor) 
        }
    }

}

export { apiError }