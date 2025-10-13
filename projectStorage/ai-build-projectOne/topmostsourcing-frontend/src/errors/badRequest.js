import { StatusCodes } from "http-status-codes";
import CustomApiError from "./customApiError.js";

class BadRequest extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
export default BadRequest;
