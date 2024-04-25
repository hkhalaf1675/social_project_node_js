class ErrorSchema extends Error{
    constructor(statusCode, message){
        super(message);
        this.statusCode = statusCode || 400;
        this.status = `${statusCode}`.startsWith(4) ? 'Fail' : 'Error';
    }
}

module.exports = ErrorSchema;