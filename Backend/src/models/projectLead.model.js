import mongoose from "mongoose";

const apiSchema = new mongoose.Schema(
    {
        endpoint: {
            type: String,
            required: true,
        },
        method: {
            type: String,
            enum: ["GET", "POST", "PUT", "DELETE"],
            required: true,
        },
        requestFormat: {
            type: Object, // structure of request body expected by backend
        },
        responseFormat: {
            type: Object, // structure of response expected by frontend
        },
        implemented: {
            type: Boolean,
            default: false,
        },
        implementedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        verfiedByFrontend: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);
const projectLeadSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            unique: true,
        },
        pushToP5Repo: {
            type: Boolean,
            default: false,
        },
        apiRepository: [apiSchema],
    },
    { timestamps: true }
);

export const ProjectLead = mongoose.model("ProjectLead", projectLeadSchema);
