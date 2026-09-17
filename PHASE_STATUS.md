# Phase Status

Honest as of now — code existing is not the same as a phase being done.
Update the Status column yourself as you actually run each script.

| Phase | What it is | File | Status |
|---|---|---|---|
| 1 | Dataset research | — (decision recorded in README/report_draft.md) | Done |
| 2 | Automated acquisition | `phase2_data_acquisition.py` | Done — ran, output confirmed |
| 3 | Data exploration + subject-wise split | `phase3_eda_and_split.py` | Written, **not run** |
| 4 | Preprocessing | `phase4_preprocessing.py` | Written, **not run** |
| 5 | Feature extraction | `phase5_feature_extraction.py` | Written, **not run** |
| 6–7 | Classical ML baseline + evaluation | `phase6_7_classical_baseline_and_eval.py` | Written, **not run** |
| 8 | Feature selection (RF + adaptive PCA) | `phase8_feature_selection_model2.py` | Written, **not run** |
| 9 | Quantum implementation (Model 3) | `phase9_quantum_model3.py` | Written, **not run** |
| 10 | Proposed algorithm | design = Phase 8+9 chain, documented in `report_draft.md` | Design finalized |
| 11 | Benchmarking | `phase11_13_benchmarking_and_graphs.py` | Written, **not run** |
| 12 | Optimization | — | **Not started** — needs real Phase 11 bottlenecks to know what to tune |
| 13 | Required graphs | code inside `phase11_13_benchmarking_and_graphs.py` | Written, **not run** |
| 14 | Research analysis | — | **Not started** — needs real numbers to analyze |
| 15 | Final report | `report_draft.md` | Partial — Intro / Literature / Dataset / Methodology / Limitations / Future Scope are real. Abstract, Results, Discussion, Conclusion are `[TO FILL IN]` |

## Why 12, 14, and part of 15 aren't just "code waiting to run"

Every other phase is a script — run it, get output, move on, fix bugs as
they come up. Phases 12 and 14, and the Results/Discussion/Conclusion
sections of 15, are different: they're conclusions *about* real
experimental output. There's no script to hand over for them because
writing one now would mean deciding the answer before the experiment
exists. Once you've run Phase 3 → 11 and have `final_model_comparison.csv`,
send it over and those get written for real, not templated.

## Run order

```
phase2_data_acquisition.py
phase3_eda_and_split.py
phase4_preprocessing.py
phase5_feature_extraction.py
phase6_7_classical_baseline_and_eval.py
phase8_feature_selection_model2.py
phase9_quantum_model3.py
phase11_13_benchmarking_and_graphs.py
```

See `README.md` for setup (Kaggle API key, `pip install -r requirements.txt`)
and `website/` for the results dashboard.
