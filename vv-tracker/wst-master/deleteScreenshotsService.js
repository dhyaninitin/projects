const workStatusSchema = require("./app/schema/work_status.schema");
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
require("dotenv").config();
const config = process.env;

const sharedKeyCredential = new StorageSharedKeyCredential(
  config.AZURE_STORAGE_ACCOUNT,
  config.AZURE_STORAGE_ACCESS_KEY
);
const blobServiceClient = new BlobServiceClient(
  `https://${config.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
  sharedKeyCredential
);
const logController = require("./app/controller/logs-controller");

const deleteAllUserScreenshots = async (req, res) => {
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const olderData = await workStatusSchema.find({
    createdat: {
      $lt: sixtyDaysAgo,
    },
  });

  try {
    let deletedScreenshotIds = [];
    logController.createDelLogOfAllScreenshots(`Delete Screenshots from Azure job has been started.`);

    for (const item of olderData) {
      const blobName = item.screen;

      if (blobName) {
        const containerClient =
          blobServiceClient.getContainerClient(config.AZURE_STORAGE_CONTAINER_NAME);
        const blobClient = containerClient.getBlobClient(blobName);

        if (await blobClient.delete()) {
          deletedScreenshotIds.push(item._id);
        }
      }
    }

    if (deletedScreenshotIds.length > 0) {
      logController.createDelLogOfAllScreenshots(`All user Screenshots older than 60 days have been deleted from Azure. Deleted screenshots count: ${deletedScreenshotIds.length}`);
    } else {
      console.log(`Error Deleting Screenshots`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  deleteAllUserScreenshots,
};
