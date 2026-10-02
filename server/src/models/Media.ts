import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface IMedia extends Document {
  userId: string;

  originalName: string;

  publicId: string;

  assetId: string;

  secureUrl: string;

  format: string;

  resourceType: string;

  bytes: number;

  optimizedBytes?: number;

  width?: number;

  height?: number;

  optimizedUrl?: string;

  qualityScore?: number;

  qualityLevel?: "low" | "medium" | "high";

  caption?: string;

  tags: string[];

  analysis?: {
    status:
      | "pending"
      | "completed"
      | "failed";

    provider?: string;

    raw?: unknown;
  };

  createdAt: Date;

  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      unique: true,
    },

    assetId: {
      type: String,
      required: true,
      unique: true,
    },

    secureUrl: {
      type: String,
      required: true,
    },

    format: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      default: "image",
    },

    bytes: {
      type: Number,
      required: true,
    },

    optimizedBytes: {
      type: Number,
      default: undefined,
    },

    width: Number,

    height: Number,

    optimizedUrl: String,

    qualityScore: Number,

    qualityLevel: {
      type: String,
      enum: [
        "low",
        "medium",
        "high",
      ],
    },

    caption: String,

    tags: {
      type: [String],
      default: [],
    },

    analysis: {
      status: {
        type: String,

        enum: [
          "pending",
          "completed",
          "failed",
        ],

        default: "pending",
      },

      provider: String,

      raw: Schema.Types.Mixed,
    },
  },

  {
    timestamps: true,
  }
);

mediaSchema.index({
  userId: 1,
  createdAt: -1,
});

export default mongoose.model<IMedia>(
  "Media",
  mediaSchema
);