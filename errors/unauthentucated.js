import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom_api.js";

class UnauthenticationError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
export default UnauthenticationError;
