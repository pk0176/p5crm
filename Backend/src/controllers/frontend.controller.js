import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { ProjectLead } from "../models/projectLead.model.js";
import { Staff } from "../models/staff.model.js";

// 1. List all projects assigned to the frontend developer
const listFrontendProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ frontend: req.user._id })
        .populate("projectLead", "name")
        .select(
            "projectID projectName sow createdAt deadline status requirement awsDetails"
        );

    if (!projects || projects.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No projects assigned to you"));
    }

    const projectsWithDetails = await Promise.all(
        projects.map(async (project) => {
            const projectLeadDoc = await ProjectLead.findOne({
                project: project._id,
            });
            const staff = await Staff.findOne({
                user: project.projectLead._id,
            }).select("name");
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
                apiEndpoints: projectLeadDoc
                    ? projectLeadDoc.apiRepository
                    : [],
            };
        })
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectsWithDetails,
                "Projects fetched successfully"
            )
        );
});

// 2. Add a new API endpoint requirement
const addApiEndpoint = asyncHandler(async (req, res) => {
    const { projectID } = req.params;
    const { endpoint, method, requestFormat, responseFormat } = req.body;

    if (!endpoint || !method) {
        throw new ApiError(400, "Endpoint and method are required");
    }

    // Validate method
    const allowedMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
    if (!allowedMethods.includes(method.toUpperCase())) {
        throw new ApiError(
            400,
            "Invalid method. Must be one of GET, POST, PUT, DELETE"
        );
    }

    // Validate formats are objects
    if (requestFormat && typeof requestFormat !== "object") {
        throw new ApiError(400, "requestFormat must be an object");
    }
    if (responseFormat && typeof responseFormat !== "object") {
        throw new ApiError(400, "responseFormat must be an object");
    }

    const project = await Project.findOne({ projectID });
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.frontend.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to add API endpoints to this project"
        );
    }

    let projectLeadDoc = await ProjectLead.findOne({ project: project._id });
    if (!projectLeadDoc) {
        projectLeadDoc = await ProjectLead.create({ project: project._id });
    }

    projectLeadDoc.apiRepository.push({
        endpoint,
        method,
        requestFormat,
        responseFormat,
    });
    await projectLeadDoc.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectLeadDoc,
                "API endpoint added successfully"
            )
        );
});

// 3. Verify an API endpoint
const verifyApiEndpoint = asyncHandler(async (req, res) => {
    const { projectID, apiId } = req.params;

    const project = await Project.findOne({ projectID });
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    if (project.frontend.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to verify APIs for this project"
        );
    }

    const projectLeadDoc = await ProjectLead.findOne({ project: project._id });
    if (!projectLeadDoc) {
        throw new ApiError(404, "Project details not found");
    }

    const api = projectLeadDoc.apiRepository.id(apiId);
    if (!api) {
        throw new ApiError(404, "API endpoint not found");
    }

    if (!api.implemented) {
        throw new ApiError(400, "API has not been implemented yet");
    }

    api.verfiedByFrontend = true;
    await projectLeadDoc.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectLeadDoc,
                "API endpoint verified successfully"
            )
        );
});

export { listFrontendProjects, addApiEndpoint, verifyApiEndpoint };
