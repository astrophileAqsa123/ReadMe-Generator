const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema(
  {
    userId: String,        // GitHub ID or Mongo user ID
    action: String,        // "generate_readme", "push_readme"
    repo: String,         // repo name (optional)
    meta: Object,         // extra data (optional)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usage", usageSchema);