import logging
import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

logger = logging.getLogger("app.requests")


# Based on "3. Define the Middleware" in
# https://dev.to/rajathkumarks/creating-a-middleware-in-fastapi-for-logging-request-and-responses-379o
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        response = await call_next(request)
        response_time = (time.perf_counter() - start_time) * 1000  # ms

        logger.info(
            "%s %s -> %s (%.1fms)",
            request.method,
            request.url.path,
            response.status_code,
            response_time,
            extra={
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "response_time": round(response_time, 1),
            },
        )
        return response
