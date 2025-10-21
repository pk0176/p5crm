import mongoose, { Schema } from "mongoose";

const staffSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        staffId: {
            type: String,
            unique: true,
            validate: {
                validator: function (value) {
                    if (this.employeeType === "employee") {
                        return /^PDS-\d{3}(\/R)?$/.test(value); //PDS-xxx
                    } else if (this.employeeType === "intern") {
                        return /^PDSI-\d{3}(\/R)?$/.test(value); // PDSI-xxx
                    } else if (this.employeeType === "others") {
                        // For 'others', ID is optional or any string
                        return true;
                    }
                    return false;
                },
                message:
                    "Invalid ID format: Use 'PDS-xxx' for 'employee' and 'PDSI-xxx' for 'intern.",
            },
        },
        employeeType: {
            type: String,
            enum: ["intern", "employee", "others"],
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Staff = mongoose.model("Staff", staffSchema);
