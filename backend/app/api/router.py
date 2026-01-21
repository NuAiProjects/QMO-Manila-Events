from fastapi import APIRouter
from app.api.routes import health, me, events, places, locations, users

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(me.router, tags=["Auth"])
api_router.include_router(events.router, tags=["Events"])
api_router.include_router(places.router, tags=["Places"])
api_router.include_router(locations.router, tags=["Locations"])
api_router.include_router(users.router, tags=["Users"])
