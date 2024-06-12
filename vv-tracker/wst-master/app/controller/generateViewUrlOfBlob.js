const azure = require("azure-storage");
require("dotenv").config();
const config = process.env;
const CONNECTION_STRING = `DefaultEndpointsProtocol=https;AccountName=${config.AZURE_STORAGE_ACCOUNT};AccountKey=${config.AZURE_STORAGE_ACCESS_KEY};EndpointSuffix=core.windows.net`;
const logController = require("./error_logs.controller");

// GET METHOD
const getImageViewUrl = async (req, res) => {
  try {
    const BlobName = req.query.blobName;
    const blobService = azure.createBlobService(CONNECTION_STRING);

    var startDate = new Date();
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 30);

    var sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: [azure.BlobUtilities.SharedAccessPermissions.READ],
        Start: startDate.setMinutes(startDate.getMinutes() - 1),
        Expiry: expiryDate,
      },
    };

    const sasToken = blobService.generateSharedAccessSignature(
      config.AZURE_STORAGE_CONTAINER_NAME,
      BlobName,
      sharedAccessPolicy
    );

    var imageUrl = {};
    imageUrl.image = blobService.getUrl(config.AZURE_STORAGE_CONTAINER_NAME, BlobName, sasToken);

    if (imageUrl) {
      res.status(200).json({ imageUrl });
    }
  } catch (error) {
    logController.logError(
      req.query.id,
      "Error getting view url of image from Azure:" + error.message,
      "getImageViewUrl",
      "GET",
      false
    );
  }
};

module.exports = { getImageViewUrl };
