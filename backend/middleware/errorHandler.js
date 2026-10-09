const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Multer file upload errors
    if (err.name === 'MulterError') {
        let message = 'File upload error';
        let statusCode = 400;

        if (err.code === 'LIMIT_FILE_SIZE') {
            message = `File size exceeds maximum limit of ${process.env.MAX_FILE_SIZE || '5MB'}`;
        } else if (err.code === 'LIMIT_FILE_COUNT') {
            message = 'Too many files uploaded';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            message = 'Unexpected file field';
        }

        return res.status(statusCode).json({
            success: false,
            message: message,
        });
    }

    // Custom file validation error from multer fileFilter
    if (err.message && err.message.includes('File type not allowed')) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: Object.values(err.errors).map(e => e.message),
        });
    }

    // Mongoose Cast Error
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format',
        });
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`,
        });
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token has expired',
        });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
