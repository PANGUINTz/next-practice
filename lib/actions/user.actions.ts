"use server";
import { createUserParams, updateUserParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import Order from "@/lib/database/models/order.model";
import Event from "@/lib/database/models/event.model";

export const createUser = async (user: createUserParams) => {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
};

export const getUserById = async (clerkId: string) => {
  try {
    await connectToDatabase();
    const findUser = await User.findOne({ clerkId });
    if (!findUser) throw new Error("User not found");
    return JSON.parse(JSON.stringify(findUser));
  } catch (error) {
    handleError(error);
  }
};

export const updateUser = async (clerkId: string, user: updateUserParams) => {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user);
    if (!updatedUser) throw new Error("User update Failed");
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
};

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      Event.updateMany(
        { _id: { $in: userToDelete.events } },
        { $pull: { organizer: userToDelete._id } }
      ),

      // Update the 'orders' collection to remove references to the user
      Order.updateMany(
        { _id: { $in: userToDelete.orders } },
        { $unset: { buyer: 1 } }
      ),
    ]);

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}
