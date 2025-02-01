import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { RequestError, ValidationError } from "../http-error";
import logger from "../logger";

export type ResponseType = "api" | "server";

const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  // Customize response based on the framework
  switch (responseType) {
    case "api": // Next.js API route
      return NextResponse.json(responseContent, { status });

    default:
      return { ...responseContent, status }; // Default case to handle others
  }
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    logger.error(
      { err: error },
      `${responseType.toUpperCase()} Error: ${error.message}`
    );
    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors
    );
  }
  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    );
    logger.error(
      { err: error },
      `Validation Error: ${validationError.message}`
    );
    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    );
  }
  if (error instanceof Error) {
    logger.error(error.message);
    return formatResponse(responseType, 500, error.message);
  }
  logger.error({ err: error }, "An unexpected error occurred");
  return formatResponse(responseType, 500, "An unexpected error occurred");
};

export default handleError;
