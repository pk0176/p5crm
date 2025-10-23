import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ProjectLead } from "../models/projectLead.model.js";
import { Project } from "../models/project.model.js";

// List all projects for the logged-in Project Lead
const listAllProjects = asyncHandler(async (req, res) => {
    // Step 1: Find all projects where the current user is the project lead.
    const assignedProjects = await Project.find({
        projectLead: req.user._id,
    }).select("_id");

    if (!assignedProjects || assignedProjects.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No projects found for this lead"));
    }

    // Step 2: Extract the project IDs from the found projects.
    const projectIds = assignedProjects.map((p) => p._id);

    // Step 3: Find the ProjectLead documents that correspond to these projects.
    const projectLeadDocs = await ProjectLead.find({
        project: { $in: projectIds },
    }).populate({
        path: "project",
        select: "projectID projectName sow createdAt deadline status awsDetails features",
    });

    // Return the list of populated ProjectLead documents
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectLeadDocs,
                "Projects fetched successfully"
            )
        );
});

// Edit a project's repository details
const editProject = asyncHandler(async (req, res) => {
    const { projectID } = req.params;
    const { pushToP5Repo } = req.body;

    // Find the project by its custom projectID
    const project = await Project.findOne({ projectID });
    if (!project) {
        throw new ApiError(404, "Project not found with the provided ID");
    }

    // Find the project lead document using the project's ObjectId
    const projectLeadDoc = await ProjectLead.findOne({ project: project._id });

    if (!projectLeadDoc) {
        // This case might indicate a data inconsistency issue
        throw new ApiError(
            404,
            "Project lead details not found for this project"
        );
    }

    // Update the fields
    if (pushToP5Repo !== undefined) {
        projectLeadDoc.pushToP5Repo = pushToP5Repo;
    }

    // Save the updated document
    await projectLeadDoc.save();

    // Populate the project details for the response
    const updatedProject = await ProjectLead.findById(
        projectLeadDoc._id
    ).populate({
        path: "project",
        select: "projectID projectName sow createdAt deadline status awsDetails features",
    });

    // Return the updated document
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedProject,
                "Project details updated successfully"
            )
        );
});

export { listAllProjects, editProject };