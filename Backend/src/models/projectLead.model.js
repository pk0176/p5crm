
import mongoose from "mongoose";

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
        apiRepository: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export const ProjectLead = mongoose.model("ProjectLead", projectLeadSchema);
