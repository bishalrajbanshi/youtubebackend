function extractPublicId(cloudinaryUrl) {
    if (!cloudinaryUrl) return null;

    // Match everything after the version (v1234567890/) and before the file extension
    const regex = /\/v\d+\/(.+)\.[a-zA-Z]+$/;
    const match = cloudinaryUrl.match(regex);

    return match ? match[1] : null;
}

export default extractPublicId;
