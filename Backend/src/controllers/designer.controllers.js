import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { Staff } from "../models/staff.model.js";

// 1. List all projects assigned to the designer
const listDesignerProjects = asyncHandler(async (req, res) => {
    // Find projects where the designer is the logged-in user
    const projects = await Project.find({ designer: req.user._id })
        .populate({
            path: "projectLead",
            select: "_id", // Select user id to find staff
        })
        .select(
            "projectID projectName sow createdAt deadline designStatus requirement"
        );

    if (!projects || projects.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No projects assigned to you"));
    }

    // Find staff names for each project lead
    const projectsWithLeadNames = await Promise.all(
        projects.map(async (project) => {
            const staff = await Staff.findOne({ user: project.projectLead._id }).select("name");
            return {
                projectID: project.projectID,
                projectName: project.projectName,
                Description: project.sow, // Aliasing sow as Description
                projectLead: staff ? staff.name : "N/A",
                createdOn: project.createdAt,
                deadline: project.deadline,
                designStatus: project.designStatus,
                uploadfigma: project.requirement, // Aliasing requirement as uploadfigma
            };
        })
    );

    return res.status(200).json(new ApiResponse(200, projectsWithLeadNames, "Projects fetched successfully"));
});

// 2. Update the design status of a project
const updateDesignStatus = asyncHandler(async (req, res) => {
    const { projectID } = req.params;
    const { designStatus } = req.body;

    // Validate input
    if (!designStatus) {
        throw new ApiError(400, "Design status is required");
    }

    // Check for valid status
    const allowedStatus = ["in progress", "not started", "on hold", "completed"];
    if (!allowedStatus.includes(designStatus)) {
        throw new ApiError(400, "Invalid design status value");
    }

    // Find the project and verify the designer
    const project = await Project.findOne({ projectID });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Ensure the logged-in user is the assigned designer
    if (project.designer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this project");
    }

    // Update the status
    project.designStatus = designStatus;
    await project.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, project, "Design status updated successfully"));
});

// 3. Update the Figma link for a project
const updateFigmaLink = asyncHandler(async (req, res) => {
    const { projectID } = req.params;
    const { figmaLink } = req.body;

    if (!figmaLink) {
        throw new ApiError(400, "Figma link is required");
    }

    // Find the project and verify the designer
    const project = await Project.findOne({ projectID });

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Ensure the logged-in user is the assigned designer
    if (project.designer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this project");
    }

    // Update the requirement field (aliased as figmaLink)
    project.requirement = figmaLink;
    await project.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, project, "Figma link updated successfully"));
});

export { listDesignerProjects, updateDesignStatus, updateFigmaLink };