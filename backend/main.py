"""
EEG feature-extraction backend.
Alzheimer's Detection Project — EEG Workspace

Real signal processing only: parses an uploaded EEGLAB .set file with
MNE-Python (the standard tool for this), computes genuine alpha-band
(8-12 Hz) power per channel via Welch's method, and genuine coherence
between a few channel pairs via scipy.signal.coherence. Returns a
downsampled preview of the raw signal for plotting.

This does NOT classify or diagnose anything -- no model has been trained
on EEG data. It only extracts real features from whatever file you upload.

Run: uvicorn main:app --reload --port 8000
"""

import shutil
import tempfile
from pathlib import Path
from typing import Optional

import numpy as np
import mne
from scipy.signal import coherence as scipy_coherence
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

mne.set_log_level("ERROR")

app = FastAPI(title="EEG Feature Extraction")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only -- tighten this before deploying anywhere real
    allow_methods=["*"],
    allow_headers=["*"],
)

ALPHA_BAND = (8.0, 12.0)
PREFERRED_COHERENCE_PAIRS = [("O1", "Fz"), ("O2", "Fz"), ("O1", "O2")]
PREVIEW_SECONDS = 5.0
PREVIEW_CHANNELS = 5
PREVIEW_POINTS = 250


def pick_coherence_pairs(channel_names):
    upper = {ch.upper(): ch for ch in channel_names}
    pairs = []
    for a, b in PREFERRED_COHERENCE_PAIRS:
        if a.upper() in upper and b.upper() in upper:
            pairs.append((upper[a.upper()], upper[b.upper()]))
    if not pairs and len(channel_names) >= 2:
        # fall back to the first couple of channels if standard names aren't present
        pairs = [(channel_names[0], channel_names[1])]
        if len(channel_names) >= 3:
            pairs.append((channel_names[0], channel_names[2]))
    return pairs


@app.post("/extract-features")
async def extract_features(set_file: UploadFile = File(...), fdt_file: Optional[UploadFile] = File(None)):
    if not set_file.filename.lower().endswith(".set"):
        raise HTTPException(400, "Please upload a .set file.")

    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        set_path = tmp_path / set_file.filename
        with open(set_path, "wb") as f:
            shutil.copyfileobj(set_file.file, f)

        if fdt_file is not None:
            fdt_path = tmp_path / fdt_file.filename
            with open(fdt_path, "wb") as f:
                shutil.copyfileobj(fdt_file.file, f)

        try:
            raw = mne.io.read_raw_eeglab(str(set_path), preload=True)
        except FileNotFoundError as e:
            raise HTTPException(
                400,
                "This .set file references a separate .fdt data file that wasn't "
                "uploaded. Upload both files together.",
            ) from e
        except Exception as e:
            raise HTTPException(400, f"Couldn't parse this .set file: {e}") from e

        ch_names = raw.info["ch_names"]
        sfreq = float(raw.info["sfreq"])
        duration_sec = float(raw.n_times / sfreq)

        # --- Alpha-band power per channel (Welch PSD, real computation) ---
        psd = raw.compute_psd(method="welch", fmin=ALPHA_BAND[0], fmax=ALPHA_BAND[1], verbose=False)
        power = psd.get_data()  # shape (n_channels, n_freqs)
        alpha_power = {ch: float(np.mean(power[i])) for i, ch in enumerate(ch_names)}

        # --- Coherence between channel pairs (real computation) ---
        data = raw.get_data()  # shape (n_channels, n_times)
        pairs = pick_coherence_pairs(ch_names)
        coherence_pairs = []
        for a, b in pairs:
            ia, ib = ch_names.index(a), ch_names.index(b)
            f, Cxy = scipy_coherence(data[ia], data[ib], fs=sfreq, nperseg=min(1024, data.shape[1]))
            band_mask = (f >= ALPHA_BAND[0]) & (f <= ALPHA_BAND[1])
            value = float(np.mean(Cxy[band_mask])) if band_mask.any() else float("nan")
            coherence_pairs.append({"pair": f"{a} \u2192 {b}", "value": value})

        # --- Downsampled preview for plotting (first few seconds, first few channels) ---
        n_preview_samples = int(min(PREVIEW_SECONDS * sfreq, raw.n_times))
        step = max(1, n_preview_samples // PREVIEW_POINTS)
        preview_channels = ch_names[:PREVIEW_CHANNELS]
        preview = {"time": (np.arange(0, n_preview_samples, step) / sfreq).round(3).tolist()}
        for i, ch in enumerate(preview_channels):
            preview[ch] = data[i, 0:n_preview_samples:step].round(6).tolist()

        return {
            "filename": set_file.filename,
            "n_channels": len(ch_names),
            "sfreq": sfreq,
            "duration_sec": duration_sec,
            "alpha_power": alpha_power,
            "coherence_pairs": coherence_pairs,
            "preview": preview,
        }


@app.get("/health")
def health():
    return {"status": "ok"}
