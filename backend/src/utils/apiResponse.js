class apiResponse {
    constructor({
        statusCode = 200,
        data = [],
        message = "Request successful",
        metadata = null,
        success = statusCode >= 200 && statusCode < 500,
    }) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = success; 
        this.metadata = metadata;
    }
}

export default apiResponse;

