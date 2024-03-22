//making api errors in our application
class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong",
        errors = [],
        stack = ""
    ) {
        //overide krenge to super call krna padega
        super(message); //override the message
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        //this is written in production grade application >> checking the error stack and then doing it
        //hmlog production mei insbko hate bhi hai.
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor); //passing just instance of constructor
        }
    }
}

export { ApiError }