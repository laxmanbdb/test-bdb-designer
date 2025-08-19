self.onmessage = function (event) {
    // Receive the Blob data from the main thread
    var blobData = event.data;

    // Create a URL for the Blob data
    var blobUrl = URL.createObjectURL(blobData);

    // Send the URL back to the main thread
    self.postMessage(blobData);
};