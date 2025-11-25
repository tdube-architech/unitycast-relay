import express from "express";
import { spawn } from "child_process";

const app = express();
app.use(express.json());

const activeStreams = {};

app.post("/start", (req, res) => {
  const { rtsp_url, rtmp_url, event_id } = req.body;

  if (!rtsp_url || !rtmp_url || !event_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (activeStreams[event_id]) {
    return res.json({ status: "already_running" });
  }

  const args = [
    "-i", rtsp_url,
    "-c:v", "copy",
    "-c:a", "aac",
    "-f", "flv",
    rtmp_url
  ];

  const ffmpeg = spawn("ffmpeg", args);
  activeStreams[event_id] = ffmpeg;

  ffmpeg.stderr.on("data", d => console.log(`[FFmpeg][${event_id}]`, d.toString()));
  ffmpeg.on("close", () => delete activeStreams[event_id]);

  return res.json({ status: "started" });
});

app.post("/stop", (req, res) => {
  const { event_id } = req.body;

  if (activeStreams[event_id]) {
    activeStreams[event_id].kill("SIGINT");
    delete activeStreams[event_id];
    return res.json({ status: "stopped" });
  }

  return res.json({ status: "not_running" });
});

app.get("/", (req, res) => {
  res.send("UnityCast Relay Server Running");
});

app.listen(3000, () => console.log("Relay Server running on port 3000"));
