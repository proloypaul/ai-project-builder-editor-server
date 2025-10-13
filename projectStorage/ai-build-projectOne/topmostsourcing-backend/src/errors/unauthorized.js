import { StatusCodes } from "http-status-codes";
import CustomApiError from "./customApiError.js";

class UnAuthorized extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
export default UnAuthorized;
