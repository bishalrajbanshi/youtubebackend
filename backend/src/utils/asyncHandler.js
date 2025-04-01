
//async await 
const asyncHandler = (func) => async(req,res,next) => {
    try {
        await func(req,res,next);
    } catch (error) {
       next(error);
    }
}

export { asyncHandler };




//     //promises base
//  const asyncHandler = (requestHandler) => {
//         (req,res,next) => {
//             Promise.resolve(requestHandler(req,res,next)).catch((error)=> next(error));
//         }
//     }
// }