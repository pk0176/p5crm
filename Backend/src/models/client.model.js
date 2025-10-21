import mongoose, { Schema } from "mongoose";
import AutoIncrement from "mongoose-sequence";

const clientSchema = new Schema(
    {
        clientId: {
            type: Number,
            required: true,
            unique: true,
            trim: true,
        },
        clientName: {
            type: String,
            required: true,
            trim: true,
        },
        clientPhone: {
            type: String,
            required: true,
            match: [
                /^[0-9]{10}$/,
                "Please enter a valid 10-digit phone number",
            ],
        },
        clientEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            match: [
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                "Please enter a valid email",
            ],
        },
        GST: {
            type: String,
            required: false,
            trim: true,
            match: [
                /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
                "Please enter a valid GST number",
            ],
        },
        billingType: {
            type: String,
            enum: ["annually", "onetime", "monthly"],
            required: true,
        },
        billingStatus: {
            type: String,
            enum: ["pending", "paid", "overdue"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const AutoIncrementFactory = AutoIncrement(mongoose);
clientSchema.plugin(AutoIncrementFactory, { inc_field: "clientId" });

export const Client = mongoose.model("Client", clientSchema);
