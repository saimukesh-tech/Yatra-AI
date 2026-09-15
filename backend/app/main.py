"""Yatra AI API - basic FastAPI backend for the YatraAI frontend.

Thin routers delegate to app/services (pure, testable logic ported 1:1 from
the frontend's TS services/utils) and app/mock_data (ported 1:1 from the
frontend's src/data). No authentication, no external AI calls - see
app/services/itinerary_service.py's docstring for how this is meant to be
swapped for a real LangGraph pipeline later without changing the API shape.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import init_db
from app.routers import destinations, group_match, health, itinerary, profile, transport, trips

logger = logging.getLogger("yatra_ai")


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={"detail": exc.errors()})


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


api_router_prefix = settings.API_PREFIX

app.include_router(health.router, prefix=api_router_prefix)
app.include_router(trips.router, prefix=api_router_prefix)
app.include_router(itinerary.router, prefix=api_router_prefix)
app.include_router(destinations.router, prefix=api_router_prefix)
app.include_router(transport.router, prefix=api_router_prefix)
app.include_router(group_match.router, prefix=api_router_prefix)
app.include_router(profile.router, prefix=api_router_prefix)


@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{api_router_prefix}/health",
    }
