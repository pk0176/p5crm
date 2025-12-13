import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { ProjectLead } from "../models/projectLead.model.js";
import { Staff } from "../models/staff.model.js";

// 1. List all projects assigned to the backend developer
const listBackendProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ backend: req.user._id })
        .populate("projectLead", "name")
        .select("projectID projectName sow createdAt deadline status requirement awsDetails");

    if (!projects || projects.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No projects assigned to you"));
    }

    const projectsWithDetails = await Promise.all(
        projects.map(async (project) => {
            const projectLeadDoc = await ProjectLead.findOne({ project: project._id });
            const staff = await Staff.findOne({ user: project.projectLead._id }).select("name");
            return {
                projectID: project.projectID,
                projectName: project.projectName,
                Description: project.sow,
                projectLead: staff ? staff.name : "N/A",
                createdOn: project.createdAt,
                deadline: project.deadline,
                status: project.status,
                figma: project.requirement,
                awsDetails: project.awsDetails,
                apiEndpoints: projectLeadDoc ? projectLeadDoc.apiRepository : [],
            };
        })
    );

    return res.status(200).json(new ApiResponse(200, projectsWithDetails, "Projects fetched successfully"));
});

// 2. Mark an API as implemented
const implementApiEndpoint = asyncHandler(async (req, res) => {
    const { projectID, apiId } = req.params;

    const project = await Project.findOne({ projectID });
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.backend.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to implement APIs for this project");
    }

    const projectLeadDoc = await ProjectLead.findOne({ project: project._id });
    if (!projectLeadDoc) {
        throw new ApiError(404, "Project details not found");
    }

    const api = projectLeadDoc.apiRepository.id(apiId);
    if (!api) {
        throw new ApiError(404, "API endpoint not found");
    }

    api.implemented = true;
    api.implementedBy = req.user._id;
    await projectLeadDoc.save();

    return res.status(200).json(new ApiResponse(200, projectLeadDoc, "API endpoint marked as implemented"));
});

export { listBackendProjects, implementApiEndpoint };