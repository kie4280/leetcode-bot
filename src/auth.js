import nacl from 'tweetnacl';
function verifySig(req) {
    // Your public key can be found on your application in the Developer Portal
    const PUBLIC_KEY = "50859e60b1f8ee81bec4047e4b30a2cfa8cc87e84f703c5c1d6a549893135f8b";
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");
    const body = JSON.stringify(req.body); // rawBody is expected to be a string, not raw bytes
    if (signature == undefined || timestamp == undefined)
        return false;
    const isVerified = nacl.sign.detached.verify(Buffer.from(timestamp + body), Buffer.from(signature, 'hex'), Buffer.from(PUBLIC_KEY, 'hex'));
    return isVerified;
}
export { verifySig };
