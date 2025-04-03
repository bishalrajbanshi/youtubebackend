const errorMiddlewares = (err, req, res, next) => {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        // error messages from Sequelize model
        const cleanErrors = err.errors.map(error => ({
          field: error.path,       // fields errors like email,passwd etc
          message: error.message,  // The error message custom message from model
          type: 'VALIDATION_ERROR' //  these are validation errors
        }));
    
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Validation failed",
          errors: cleanErrors
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

