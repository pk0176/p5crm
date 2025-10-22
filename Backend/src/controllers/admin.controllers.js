import { Staff } from "../models/staff.model.js";
import { User } from "../models/user.model.js";
import { Client } from "../models/client.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseDate } from "../utils/parseDate.js";
import { Project } from "../models/project.model.js";
import mongoose from "mongoose";
// Create Staff
const createStaff = asyncHandler(async (req, res) => {
    const { name, email, password, role, staffId, employeeType, status } =
        req.body;

    //  Validate required fields
    if (
        [name, email, password, role, staffId, employeeType].some(
            (field) => !field || field.trim() === ""
        )
    ) {
        throw new ApiError(400, "All required fields must be provided");
    }

    //  Validate employeeType
    const validTypes = ["employee", "intern", "others"];
    if (!validTypes.includes(employeeType)) {
        throw new ApiError(
            400,
            "Invalid employeeType. Must be 'employee', 'intern' or 'others'"
        );
    }

    // Validate staffId format based on employeeType
    if (employeeType === "employee" && !/^PDS-\d{3}(\/R)?$/.test(staffId)) {
        throw new ApiError(400, "Employee ID must be in 'PDS-001' format");
    }
    if (employeeType === "intern" && !/^PDSI-\d{3}(\/R)?$/.test(staffId)) {
        throw new ApiError(400, "Intern ID must be in 'PDSI-001' format");
    }
    // 'others' can have any staffId

    //Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    //Create User
    const user = await User.create({
        email,
        password,
        roles: [role.toLowerCase()],
    });

    // Create Staff
    const staff = await Staff.create({
        name,
        staffId,
        employeeType,
        status: status || "active",
        user: user._id,
    });

    // Hide password before returning
    user.password = undefined;

    return res
        .status(201)
        .json(
            new ApiResponse(201, { user, staff }, "Staff created successfully")
        );
});

//List all the staff
const listStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.find().populate("user", "-password"); //exclude password
    return res
        .status(200)
        .json(new ApiResponse(200, staff, "Fetched all staff"));
});

const admintest = asyncHandler(async (req, res) => {
    const admin = req.user;
    return res
        .status(200)
        .json(new ApiResponse(200, admin, "Admin is logged in"));
});

//UpdateStaff
const updateStaff = asyncHandler(async (req, res) => {
    const { staffId } = req.params; // MongoDB _id of staff
    const {
        name,
        email,
        role,
        staffId: newStaffId, //store the staffId in newStaffId variable  (req.params already using staffId)
        employeeType,
        status,
    } = req.body;

    //  Validate staffId
    if (!mongoose.Types.ObjectId.isValid(staffId)) {
        throw new ApiError(400, "Invalid staff ID");
    }

    const staff = await Staff.findById(staffId);
    if (!staff) {
        throw new ApiError(404, "Staff not found");
    }

    //  Update associated User if email or role changed
    if (email || role) {
        const user = await User.findById(staff.user);
        if (!user) {
            throw new ApiError(404, "User account not found");
        }

        // Email update validation
        if (email) {
            const existingUser = await User.findOne({
                email,
                _id: { $ne: user._id },
            });
            if (existingUser) {
                throw new ApiError(400, "Email already in use");
            }
            user.email = email;
        }

        // Role update
        if (role) {
            user.roles = [role.toLowerCase()];
        }

        await user.save();
    }

    // Validate staffId format if employeeType or staffId is updated
    if (employeeType || newStaffId) {
        const type = employeeType || staff.employeeType;
        const idToValidate = newStaffId || staff.staffId;

        if (type === "employee" && !/^PDS-\d{3}(\/R)?$/.test(idToValidate)) {
            throw new ApiError(400, "Employee ID must be in 'PDS-001' format");
        }
        if (type === "intern" && !/^PDSI-\d{3}(\/R)?$/.test(idToValidate)) {
            throw new ApiError(400, "Intern ID must be in 'PDSI-001' format");
        }
        // 'others' can have any ID
    }

    //  Prepare update object
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (newStaffId !== undefined) updates.staffId = newStaffId;
    if (employeeType !== undefined) updates.employeeType = employeeType;
    if (status !== undefined) updates.status = status;

    // Update staff document
    const updatedStaff = await Staff.findByIdAndUpdate(
        staffId,
        { $set: updates },
        { new: true, runValidators: true }
    ).populate("user", "-password");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedStaff, "Staff updated successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    if (!userId || !newPassword) {
        throw new ApiError(400, "User ID and new password are required");
    }

    // Find user and staff
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { message: "Password updated successfully" },
                "Password changed successfully"
            )
        );
});

// Create Client
const createClient = asyncHandler(async (req, res) => {
    const {
        clientName,
        clientPhone,
        clientEmail,
        GST,
        billingType,
        billingStatus,
    } = req.body;

    // Validate required fields
    if (!clientName || !clientPhone || !clientEmail || !billingType || !GST) {
        throw new ApiError(400, "All required fields must be provided");
    }

    // Check if client already exists with same email or phone
    const existingClient = await Client.findOne({
        $or: [{ clientEmail }, { clientPhone }],
    });

    if (existingClient) {
        throw new ApiError(
            400,
            "Client with this email or phone already exists"
        );
    }

    // Create client
    const client = await Client.create({
        clientName,
        clientPhone,
        clientEmail,
        GST,
        billingType,
        billingStatus: billingStatus || "pending",
    });

    return res
        .status(201)
        .json(new ApiResponse(201, client, "Client created successfully"));
});

// List Clients
const listClients = asyncHandler(async (req, res) => {
    const clients = await Client.find();

    if (!clients?.length) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No clients found"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, clients, "Clients fetched successfully"));
});

//create Project
const createProject = asyncHandler(async (req, res) => {
    const {
        clientName,
        projectID,
        projectName,
        projectValue,
        advancePayment,
        paymentDate,
        projectLead,
        designer,
        frontend,
        backend,
        deadline,
        awsDetails,
        requirement,
        sow,
    } = req.body;

    //  Validate required fields
    if (
        !clientName ||
        !project ||
        !projectName ||
        !projectValue ||
        !projectLead ||
        !designer ||
        !frontend ||
        !backend ||
        !deadline ||
        !awsDetails?.id ||
        !awsDetails?.password
    ) {
        throw new ApiError(400, "All required fields must be provided");
    }
    if (!advancePayment) {
        advancePayment = 0;
    }
    // Validate MongoDB ObjectIds
    const objectIds = [clientName, projectLead, designer, frontend, backend];
    const invalidId = objectIds.some(
        (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidId) {
        throw new ApiError(400, "One or more provided IDs are invalid");
    }

    // Validate projectID format
    if (!/^PDS\d{3}$/.test(projectID)) {
        throw new ApiError(400, "Project ID must be in 'PDSXXX' format");
    }

    //Extract the numeric part of the projectID and validate it
    const projectIdNumber = parseInt(projectID.substring(3), 10);
    if (projectIdNumber < 129) {
        throw new ApiError(400, "Project ID number must be 129 or greater");
    }

    // Check if projectID already exists
    const existingProject = await Project.findOne({ projectID });
    if (existingProject) {
        throw new ApiError(400, "Project with this ID already exists");
    }

    //Validate numeric fields
    if (projectValue < 0 || advancePayment < 0) {
        throw new ApiError(
            400,
            "Project value and advance payment must be non-negative numbers"
        );
    }

    // Validate and parse date fields (dd-mm-yyyy)
    const paymentDateObj = parseDate(paymentDate);
    const deadlineObj = parseDate(deadline);

    if (!paymentDateObj || !deadlineObj) {
        throw new ApiError(400, "Dates must be in dd-mm-yyyy format");
    }

    const now = new Date();
    if (deadlineObj <= now) {
        throw new ApiError(400, "Deadline must be a future date");
    }

    // Create Project
    const project = await Project.create({
        clientName,
        projectID,
        projectName,
        projectValue,
        advancePayment,
        paymentDate: paymentDateObj,
        projectLead,
        designer,
        frontend,
        backend,
        deadline: deadlineObj,
        awsDetails,
        requirement,
        sow,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, project, "Project created successfully"));
});
//list Project
const listProject = asyncHandler(async (req, res) => {
    const project = await Project.find();
    return res
        .status(200)
        .json(new ApiResponse(200, project, "Fetched all project"));
});

//Update project

const updateProject = asyncHandler(async (req, res) => {
    const { projectID } = req.params; //Project ID from URL
    const updateData = req.body;

    //Fetch existing project;
    const existingProject = await Project.findOne({ projectID });
    if (!existingProject) {
        throw new ApiError(404, "Project not found");
    }

    //Define allowed fields for update
    const allowedFields = [
        "projectID",
        "projectName",
        "projectValue",
        "advancePayment",
        "paymentDate",
        "projectLead",
        "designer",
        "frontend",
        "backend",
        "deadline",
        "awsDetails",
        "requirement",
        "sow",
    ];

    //filter out only allowed fields from request body
    const updates = {};
    for (const key of allowedFields) {
        if (updateData[key] !== undefined) {
            updates[key] = updateData[key];
        }
    }
    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No valid fields to update");
    }
    //Validate ObjectId fields if present
    const objectIdFields = ["projectLead", "designer", "frontend", "backend"];
    for (const field of objectIdFields) {
        if (
            updates[field] &&
            !mongoose.Types.ObjectId.isValid(updates[field])
        ) {
            throw new ApiError(400, `Invalid ObjectId for field: ${field}`);
        }
    }

    //Validate numeric fields if present
    if (updates.projectValue !== undefined && updates.projectValue < 0) {
        throw new ApiError(400, "Project value must be a non-negative number");
    }
    if (updates.advancePayment !== undefined && updates.advancePayment < 0) {
        throw new ApiError(
            400,
            "Advance payment must be a non-negative number"
        );
    }

    // Validate projectID format if present
    if (updates.projectID) {
        if (!/^PDS\d{3}$/.test(updates.projectID)) {
            throw new ApiError(400, "Project ID must be in 'PDSXXX' format");
        }

        //Extract the numeric part of the projectID and validate it
        const projectIdNumber = parseInt(updates.projectID.substring(3), 10);
        if (projectIdNumber < 129) {
            throw new ApiError(400, "Project ID number must be 129 or greater");
        }

        // Check if projectID already exists
        const existingProjectById = await Project.findOne({
            projectID: updates.projectID,
        });
        if (
            existingProjectById &&
            existingProjectById.projectID !== projectID
        ) {
            throw new ApiError(400, "Project with this ID already exists");
        }
    }

    //Validate date fields (dd-mm-yyyy format)
    if (updates.paymentDate) {
        const parsed = parseDate(updates.paymentDate);
        if (!parsed) {
            throw new ApiError(
                400,
                "Invalid paymentDate format (use dd-mm-yyyy)"
            );
        }
        updates.paymentDate = parsed;
    }

    if (updates.deadline) {
        const parsed = parseDate(updates.deadline);
        if (!parsed) {
            throw new ApiError(400, "Invalid deadline format (use dd-mm-yyyy)");
        }
        if (parsed <= new Date()) {
            throw new ApiError(400, "Deadline must be a future date");
        }
        updates.deadline = parsed;
    }

    //Perform the update
    const updatedProject = await Project.findOneAndUpdate(
        { projectID },
        updates,
        {
            new: true, // return updated document
            runValidators: true, // ensure schema validation
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedProject, "Project updated successfully")
        );
});

//Delete project

const deleteProject = asyncHandler(async (req, res) => {});

export {
    createStaff,
    listStaff,
    admintest,
    changePassword,
    updateStaff,
    createClient,
    listClients,
    createProject,
    listProject,
    updateProject,
};
