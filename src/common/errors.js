class ApiError extends Error {
  constructor(type, message, status) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.type = type
    this.status = status
  }
}

class InternalServerError extends ApiError {
  constructor(type = 'E_INTERNAL_SERVER_ERROR', message = 'Unknown error.') {
    super(type, message, 500)
  }
}

class ValidationError extends ApiError {
  constructor(message = 'Validation did not pass.') {
    super('E_VALIDATION', message, 400)
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'The user was not authorized.') {
    super('E_UNAUTHORIZED', message, 401)
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'The user is not allowed to access this resource.') {
    super('E_FORBIDDEN', message, 403)
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Target resource was not found.') {
    super('E_NOT_FOUND', message, 404)
  }
}

class ConflictError extends ApiError {
  constructor(message = 'Conflict record found.') {
    super('E_CONFLICT', message, 409)
  }
}

module.exports = {
  ApiError,
  InternalServerError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
}
