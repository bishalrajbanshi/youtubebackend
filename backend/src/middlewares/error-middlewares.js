const errorMiddlewares = (err, req, res, next) => {
    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const errors = err.errors.map(error => ({
            field: error.path,
            message: error.message,
            type: error.type.includes('Validation') ? 'VALIDATION_ERROR' : error.type
        }));
        
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Validation failed",
            errors 
        });
    }

    // Handle custom API errors
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            statusCode: err.statusCode,
            message: err.message,
            errors: err.errors || []
        });
    }

    // Handle all other errors
    res.status(500).json({
        success: false,
        statusCode: 500,
        message: err.message || "Internal server error",
        errors: []
    });
};

export default errorMiddlewares;

