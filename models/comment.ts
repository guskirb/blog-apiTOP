import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const CommentModel = mongoose.model("Comment", CommentSchema);
export default CommentModel;