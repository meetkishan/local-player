const socket = io();
let fileChunks = [];
let fileMetadata = null;

socket.on('start-file', (metadata) => {
  fileMetadata = metadata;
  fileChunks = []; // Reset file chunks
  console.log('Receiving file:', fileMetadata.name);
});

socket.on('file-chunk', (chunk) => {
  // Add received chunk to the fileChunks array
  fileChunks.push(new Uint8Array(chunk));
});

socket.on('end-file', () => {
  // Create a Blob from the received chunks and play the audio
  const blob = new Blob(fileChunks, { type: fileMetadata.type });
  const url = URL.createObjectURL(blob);
  const audioPlayer = document.getElementById('audio-player');
  audioPlayer.src = url;
  audioPlayer.play();
  console.log('Playing file:', fileMetadata.name);
});
