"use server";
import { createUserParams, updateUserParams } from "@/types";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import { json } from "stream/consumers";

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

export const deleteUser = async (clerkId: string) => {
  try {
    await connectToDatabase();

    const deletedUser = await User.findByIdAndDelete({ clerkId });
    if (!deletedUser) throw new Error("User delete Failed");
    return JSON.parse(JSON.stringify(deletedUser));
  } catch (error) {
    handleError(error);
  }
};
