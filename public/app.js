const socket = io();

document.getElementById('file-input').addEventListener('change', function(event) {
  const files = event.target.files;
  if (files.length > 0) {
    const musicFile = files[0];

    // Send file metadata to the desktop
    socket.emit('start-file', {
      name: musicFile.name,
      size: musicFile.size,
      type: musicFile.type
    });

    // Read and send file in chunks
    const chunkSize = 64 * 1024; // 64KB per chunk
    let offset = 0;

    function sendChunk() {
      const fileReader = new FileReader();
      const blob = musicFile.slice(offset, offset + chunkSize);
      fileReader.onload = function(event) {
        if (event.target.result) {
          socket.emit('file-chunk', event.target.result); // Send chunk
          offset += chunkSize;
          if (offset < musicFile.size) {
            sendChunk(); // Read and send next chunk
          } else {
            socket.emit('end-file');
          }
        }
      };
      fileReader.readAsArrayBuffer(blob);
    }

    sendChunk(); // Start sending the file
  }
});
