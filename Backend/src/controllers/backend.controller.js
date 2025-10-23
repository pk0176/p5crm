
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
                pushToP5Repo: projectLeadDoc ? projectLeadDoc.pushToP5Repo : false,
                apiRepository: projectLeadDoc ? projectLeadDoc.apiRepository : "",
                features: projectLeadDoc ? projectLeadDoc.features : [],
            };
        })
    );

    return res.status(200).json(new ApiResponse(200, projectsWithDetails, "Projects fetched successfully"));
});

// 2. Mark a feature as developed
const developFeature = asyncHandler(async (req, res) => {
    const { projectID, featureId } = req.params;
    const { apiRepository } = req.body;

    if (!apiRepository) {
        throw new ApiError(400, "API repository link is required");
    }

    const project = await Project.findOne({ projectID });
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.backend.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to develop features for this project");
    }

    const projectLeadDoc = await ProjectLead.findOne({ project: project._id });
    if (!projectLeadDoc) {
        throw new ApiError(404, "Project lead details not found for this project");
    }

    const feature = projectLeadDoc.features.id(featureId);
    if (!feature) {
        throw new ApiError(404, "Feature not found");
    }

    feature.isDeveloped = true;
    projectLeadDoc.apiRepository = apiRepository;
    await projectLeadDoc.save();

    return res.status(200).json(new ApiResponse(200, projectLeadDoc, "Feature marked as developed successfully"));
});

export { listBackendProjects, developFeature };
