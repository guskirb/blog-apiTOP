import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { DateTime } from "luxon";

const PostSchema = new Schema({
  title: { type: String, required: true },
  image_url: { type: String, required: true },
  post: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
});

PostSchema.virtual('date_formatted').get(function() {
  return  DateTime.fromJSDate(this.date).toISODate(DateTime.DATE_FULL);
})

const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;
