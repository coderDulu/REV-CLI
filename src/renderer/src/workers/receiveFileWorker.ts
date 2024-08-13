// worker.js
self.onmessage = function (e) {
  const data = e.data;
  const { type, url } = data;
  if (type === "connect") {
    connectWebsocket(url);
  }
};

function connectWebsocket(url: string) {
  const websocket = new WebSocket(url);
  let progress = 0;

  let fileData = new Blob([]);

  let currentSize = 0;

  let file;

  websocket.addEventListener("message", async (ev) => {
    const text = await (ev.data as Blob).text();
    try {
      file = JSON.parse(text);
      clear();

      self.postMessage({
        type: "fileInfo",
        data: file,
      });
    } catch (err) {
      currentSize += ev.data.size;
      progress = (currentSize / file.size) * 100;

      fileData = new Blob([fileData, ev.data]);

      if (progress < 100) {
        self.postMessage({
          type: "file",
          progress,
        });
      } else if (progress === 100) {
        self.postMessage({
          type: "file",
          data: fileData,
          progress,
        });
      }
    }
  });

  function clear() {
    progress = 0;
    currentSize = 0;
    fileData = new Blob([]);
  }
}
