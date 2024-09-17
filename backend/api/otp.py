import base64
import secrets
import qrcode
from io import BytesIO
import time
import hmac
import hashlib

def gen_provisioning_uri(secret, user):
    return f"otpauth://totp/trans:{user}?secret={secret}&issuer=trans"

def gen_b32secret():
    return base64.b32encode(secrets.token_bytes(20)).decode()

def gen_qrcode(provisioning_url):
    buffered = BytesIO()
    img = qrcode.make(provisioning_url)
    img.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode()


def int_to_bytearray(i):
    padding = 8
    res = bytearray()
    while i != 0:
        res.append(i & 0xFF)
        i >>= 8
    return bytearray(reversed(res)).rjust(padding, b"\0")


def gen_otp(secret):
    initial_time = int(time.time())
    interval = 30
    ct = int(initial_time / interval)
    hash = hmac.new(base64.b32decode(secret), int_to_bytearray(ct), hashlib.sha1).digest()
    offset = hash[-1] & 0xF
    code = (
        (hash[offset] & 0x7F) << 24
        | (hash[offset + 1] & 0xFF) << 16
        | (hash[offset + 2] & 0xFF) << 8
        | (hash[offset + 3] & 0xFF)
    )
    str_code = str(10_000_000_000 + (code % 10**6))[-6:]
    return str_code
