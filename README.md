# Alzheimer's Detection — Hybrid Classical ML + Quantum Computing

Local module bundle (Colab-specific code removed) for running the full
pipeline in VS Code, Antigravity, or any local Python environment.

## Setup

```bash
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**One manual step, required before Phase 2:** generate a Kaggle API token
at kaggle.com → Settings → API → "Create New Token", then place the
downloaded `kaggle.json` at:
- macOS/Linux: `~/.kaggle/kaggle.json` (then `chmod 600 ~/.kaggle/kaggle.json`)
- Windows: `C:\Users\<you>\.kaggle\kaggle.json`

Everything else is scripted.

## Run order

```bash
python phase2_data_acquisition.py
python phase3_eda_and_split.py
python phase4_preprocessing.py
python phase5_feature_extraction.py       # GPU optional, CPU works but slower
python phase6_7_classical_baseline_and_eval.py
python phase8_feature_selection_model2.py
python phase9_quantum_model3.py
python phase11_13_benchmarking_and_graphs.py
```

All paths are centralized in `config.py` — everything downloads/saves under
`./data/`. Nothing else needs editing to move machines.

## Notes carried over from the pipeline's design

- **Phase 4** merges `ModerateDemented` into `MildDemented` as `Demented`
  by default (that class had only ~2 subjects — too few for its own
  train/val/test split). Set `MERGE_MODERATE_INTO_MILD = False` in
  `phase4_preprocessing.py` to keep 4 classes instead.
- **Phase 9**'s quantum kernel stage stratified-subsamples the training
  data (100/class) and test data (50/class) by default — quantum kernel
  simulation scales roughly quadratically with sample count. This is
  stated explicitly in the script's output, not hidden.
- **Phase 11**'s comparison keeps Model 3's smaller evaluation set visible
  rather than treating all three models' numbers as directly comparable
  at face value.

See `report_draft.md` (in the earlier chat output) for the write-up
skeleton — Results/Discussion/Conclusion are intentionally left as
placeholders until real numbers exist from a full local run.

## Website (results dashboard)

A standalone React + Vite site lives in `website/` — a real, runnable
project (not just a preview file), with its own `package.json`.

```bash
cd website
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173). Paste the
contents of `final_model_comparison.csv` (from Phase 11) into the Results
section to render the comparison charts — it persists in the browser via
localStorage, so it's still there next time you open it.

`npm run build` produces a static `dist/` folder if you want to deploy it
anywhere (Vercel, Netlify, GitHub Pages, etc.).

## Live Camera Scanner & Report OCR Feature

The frontend includes a **Live Camera Report & Scan Scanner** (`website/src/CameraScanner.jsx`):
- Click **"📷 Scan Report via Camera"** in Step 1 of the Diagnostic Workspace.
- Supports physical webcams via `getUserMedia` and an interactive HUD viewfinder.
- Includes a **Simulated Optical Camera Feed** fallback for testing without a physical webcam.
- Performs simulated OCR feature extraction and populates the Classical ML / Quantum GPU diagnostic pipeline.

## MNE-Python EEG Backend Server

A dedicated FastAPI backend server lives in `backend/` for parsing raw EEGLAB (`.set` / `.fdt`) signal files:

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend utilizes **MNE-Python** to calculate alpha-band (8–12 Hz) spectral power via Welch's PSD method and inter-channel coherence via `scipy.signal.coherence`.

