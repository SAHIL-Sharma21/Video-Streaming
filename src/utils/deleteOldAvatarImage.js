//making one method thich will delete one value and update with new one

import { User } from "../models/user.model.js";

const deleteOldAvatarImage = async (userId) => {
    //finding a user with his id and delete the value
    const user = await User.findById(userId);
    user.avatar = undefined;
    return;
}

export { deleteOldAvatarImage };