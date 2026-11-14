"""Small, dependency-free helpers for the public webcam WebSocket endpoint."""

import base64
import binascii
import os

DEFAULT_ALLOWED_ORIGINS = (
    "https://face-emotion-frontend.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
)
MAX_IMAGE_BYTES = 5 * 1024 * 1024


def allowed_origins() -> tuple[str, ...]:
    configured = os.getenv("ALLOWED_ORIGINS", "")
    values = configured.split(",") if configured.strip() else DEFAULT_ALLOWED_ORIGINS
    return tuple(origin.strip().rstrip("/") for origin in values if origin.strip())


def origin_is_allowed(origin: str | None) -> bool:
    # Non-browser clients commonly omit Origin. Browser requests must match an explicit origin.
    if origin is None:
        return True
    return origin.rstrip("/") in allowed_origins()


def decode_image_payload(payload: str) -> bytes | None:
    """Decode a base64 image/data URL, rejecting oversized or malformed payloads."""
    encoded = payload.split(",", 1)[-1]
    # Check the encoded length before allocating the decoded byte buffer.
    if not encoded or len(encoded) > ((MAX_IMAGE_BYTES + 2) // 3) * 4:
        return None
    try:
        decoded = base64.b64decode(encoded, validate=True)
    except (binascii.Error, ValueError):
        return None
    return decoded if decoded and len(decoded) <= MAX_IMAGE_BYTES else None
