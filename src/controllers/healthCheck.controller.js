
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    //TODO: build a healthcheck response that simply returns the OK status as json with a message
    //returing the health status

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Everythings is fine status OK!"));
})

export {
    healthcheck
}

