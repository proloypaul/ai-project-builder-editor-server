import { StatusCodes } from "http-status-codes";
import CustomApiError from "./customApiError.js";

class NotFound extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
export default NotFound;
