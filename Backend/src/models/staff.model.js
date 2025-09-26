import mongoose, { Schema } from "mongoose";

const staffSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        internId: {
            type: String,
            required: false,
            unique: true,
        },
        employeeType: {
            type: String,
            enum: ["intern", "full-time"],
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Staff = mongoose.model("Staff", staffSchema);
