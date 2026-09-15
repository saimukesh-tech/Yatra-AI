"""Intentionally empty of static itinerary data.

The frontend's itineraryService.ts never used a fixed list of pre-written
itineraries - it *generates* one on demand from mockAttractions + the trip's
interests/budget/time (see buildItinerary() in that file). This backend
mirrors that exactly in app/services/itinerary_service.py, using
app/mock_data/attractions.py as the raw material. This module exists only
to keep the mock_data/ package matching the structure requested; generated
itineraries are persisted to the database (app/models/itinerary.py), not
read from a static mock file.
"""
