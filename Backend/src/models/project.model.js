import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        clientName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        projectName: {
            type: String,
            required: true,
        },
        projectValue: {
            type: Number,
            required: true,
        },
        advancePayment: {
            type: Number,
            required: true,
        },
        paymentDate: {
            type: Date,
            required: true,
        },
        projectLead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        designer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        frontend: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        backend: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
        awsDetails: {
            id: {
                type: String,
                required: true,
            },
            password: {
                type: String,
                required: true,
            },
        },
        //Figma link
        requirement: {
            type: String,
        },
        //Pdf link
        sow: {
            type: String,
        },
    },
    { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
