import base64
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from security import MAX_IMAGE_BYTES, decode_image_payload, origin_is_allowed


class SecurityTests(unittest.TestCase):
    def test_allows_configured_frontend_and_local_origins(self):
        self.assertTrue(origin_is_allowed("https://face-emotion-frontend.vercel.app"))
        self.assertTrue(origin_is_allowed("http://localhost:3000/"))

    def test_rejects_untrusted_browser_origin(self):
        self.assertFalse(origin_is_allowed("https://attacker.example"))

    def test_origin_allowlist_can_be_configured(self):
        with patch.dict(os.environ, {"ALLOWED_ORIGINS": "https://portfolio.example, https://demo.example/"}):
            self.assertTrue(origin_is_allowed("https://demo.example"))
            self.assertFalse(origin_is_allowed("https://face-emotion-frontend.vercel.app"))

    def test_accepts_base64_and_data_url(self):
        payload = base64.b64encode(b"image bytes").decode("ascii")
        self.assertEqual(decode_image_payload(payload), b"image bytes")
        self.assertEqual(decode_image_payload(f"data:image/jpeg;base64,{payload}"), b"image bytes")

    def test_rejects_malformed_and_oversized_payloads(self):
        self.assertIsNone(decode_image_payload("%%%"))
        self.assertIsNone(decode_image_payload("a" * (((MAX_IMAGE_BYTES + 2) // 3) * 4 + 4)))


if __name__ == "__main__":
    unittest.main()
