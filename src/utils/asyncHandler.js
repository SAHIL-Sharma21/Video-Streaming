//making asyncHandler functon and exporting it as we are writing utility for conection to database.


//we are making 2  methos to do it we can use anyone depending upon our usecase
// const asyncHandler = (requsthandler) => {
//     //here we have to retun as callback function if we not then it will give error
//     return (req, res, next) => {
//         //we are invoking the promise here
//         Promise.resolve(requsthandler(req, res, next)).catch((err) => next(err));
//     }
// }

export { asyncHandler }

//making asyncHnadler a higher order function >> as function pass as a parameter in another function

// const asyncHandler = () => {() => {}}// this is how we are doing it
// const asyncHandler = () => async () => {}// making it async functions

//it just a wrapper function this coding approach taken in industries

const asyncHandler = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next)
        } catch (error) {
            res.status(err.code || 500).json({
                success: false,
                message: err.message
            })
        }
    }
}
// const asyncHandler = (func) => async (req, res, next) => {
//     try {
//         await func(req, res, next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             sucess: false,
//             message: err.message
//         });
//     }
// }