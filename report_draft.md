# Alzheimer's Disease Detection Using a Hybrid Classical ML + Quantum Computing Algorithm

*Draft report — sections marked [TO FILL IN] need real numbers from running
Phases 4–11. Nothing below those markers should be written until you have
that output; filling them in early with plausible-looking numbers would be
fabricating results.*

## Abstract
[TO FILL IN — write this last, after Results/Discussion are done. 3-4
sentences: problem, method, headline result, one honest caveat.]

## 1. Introduction
Alzheimer's disease is a progressive neurodegenerative condition, and early,
automated detection from brain MRI is a well-studied but still open medical
imaging problem. This project builds a classical machine learning system for
Alzheimer's-stage classification, then investigates whether combining it with
quantum computing — via a quantum feature map and quantum kernel — can match
or improve on that classical baseline, either in accuracy or in computational
efficiency. Rather than assuming quantum methods are automatically better,
this project measures the comparison directly and reports the result
honestly, including if the quantum stage turns out to be slower.

## 2. Literature Review
Quantum machine learning for Alzheimer's detection is a small but active
area. Belay, Walle, and Haile (2024, *Scientific Reports*) combined features
from customized VGG16 and ResNet50 networks with a quantum support vector
machine classifier on merged ADNI I/II MRI data, reporting very high
reported accuracy — a figure worth treating cautiously in your own
Discussion, since very high numbers on MRI slice data are often a sign of
patient-level leakage rather than genuine generalization, and the published
splitting methodology should be checked before treating it as a benchmark.
Cappiello and Caruso (2024) compared classical and quantum kernel methods on
the DARWIN handwriting dataset for Alzheimer's prediction and found quantum
kernels sometimes matched or exceeded classical ones. Mazher et al. (2024)
proposed a hybrid quantum-classical deep learning architecture for medical
image classification more broadly. Kim (2023, IEEE URTC) explored hybrid
quantum-classical ML specifically for dementia detection.

None of these combine Random Forest feature ranking with PCA dimensionality
reduction and a quantum kernel SVM on an explicitly subject-wise-split OASIS
dataset — most published work in this space does not document patient-level
splitting at all, which is itself a methodological gap this project
addresses rather than a claim of an entirely new algorithm family.

## 3. Dataset Description
- Source: OASIS-1-derived MRI slices, via the Kaggle dataset
  `shreyanmohanty/oasis-alzheimers-detection-multi-class-dataset`
  (patient-split variant of `ninadaithal/imagesoasis`).
- Modality: T1-weighted MRI, converted to 2D grayscale slice images.
- Classes used: NonDemented, VeryMildDemented, Demented (Mild+Moderate
  merged — see Limitations for why).
- [TO FILL IN — paste the real subject/image counts per class and per
  split from your Phase 3 and Phase 4 console output.]
- A data-integrity finding: the raw Kaggle export ships duplicate,
  same-named class folders from a Roboflow train/valid/test split with
  identical subject counts per duplicate pair — a leakage risk if used as
  provided. This project pooled all images by class and rebuilt an
  independent subject-wise 70/15/15 split instead of trusting that
  structure (Phase 3).

## 4. Methodology
1. Automated acquisition via the Kaggle API (Phase 2).
2. Subject-ID extraction from filenames, pooling, and a fresh subject-wise
   split with an automated zero-leakage assertion (Phase 3).
3. Preprocessing: grayscale conversion, resize to 64×64, class-imbalance
   documented rather than hidden (Phase 4).
4. Feature extraction: 512-dimensional embeddings from a frozen,
   ImageNet-pretrained ResNet18 (Phase 5).
5. Classical baseline: Logistic Regression, SVM (RBF), Random Forest, KNN,
   XGBoost, all class-weighted, evaluated with the full metric set (Phase
   6–7).
6. Feature selection: Random Forest importance ranking to 128 features,
   then PCA to however many components reach 95% cumulative explained
   variance (capped at 10 for quantum feasibility) — a data-driven choice,
   not a guessed number (Phase 8).
7. Quantum stage: ZZFeatureMap → FidelityQuantumKernel → QSVC, evaluated on
   a stated, stratified subsample (simulator cost scales roughly
   quadratically with sample count) (Phase 9).
8. Final benchmarking across all three models on the same evaluation
   protocol, with the subsampling caveat kept visible rather than hidden
   (Phase 11).

## 5. Proposed Algorithm
**Data → ResNet18 embedding → RF importance ranking (top 128) → adaptive
PCA (≤10 components) → ZZFeatureMap → quantum kernel (fidelity-based) →
SVM classification.**

This is Model 3 in the benchmarking. Models 1 (raw features → SVM) and 2
(RF+PCA → classical SVM) exist specifically to isolate what the quantum
step adds or costs relative to feature selection alone.

## 6. System Architecture
[Diagram — can be drawn once the pipeline is finalized; the block sequence
above is the content for it.]

## 7. Implementation
Python / scikit-learn / PyTorch (ResNet18) / Qiskit + qiskit-machine-learning,
run on Google Colab. Scripts: `phase2`–`phase11` (see project files).

## 8. Results
[TO FILL IN — paste the Phase 11 comparison table and the three graphs:
final_metric_comparison.png, final_timing_comparison.png,
confusion_matrices.png]

## 9. Discussion
[TO FILL IN — use the "HONEST VERDICT" printout from Phase 11 as your
starting point. Address explicitly: did accuracy improve, stay flat, or
drop? Was the quantum stage faster or slower, and why (simulator overhead
vs. reduced feature count)? Does the subsampling in Model 3 limit how much
weight the comparison can bear?]

## 10. Limitations
- ModerateDemented had only ~2 subjects total; merged into Demented rather
  than treated as its own class (Section 3/Phase 4 decision).
- Model 3 was evaluated on a stratified subsample, not the full test set,
  due to quantum kernel simulation cost — reported explicitly, not
  averaged away.
- Some secondary sources describe this Kaggle dataset's subject count
  inconsistently (416 vs. ~1,000); worth noting as a dataset-provenance
  caveat rather than treated as settled.
- This is an academic classification exercise on a public research
  dataset, not a validated clinical diagnostic tool.

## 11. Conclusion
[TO FILL IN — 2-3 sentences once Results/Discussion exist.]

## 12. Future Scope
- Evaluate the quantum kernel on real quantum hardware (IBM Quantum) rather
  than only a simulator, to see whether the accuracy/time trade-off changes.
- Extend to ADNI for multimodal MRI+PET once DUA access is granted.
- Explore EEG (OpenNeuro ds004504) as an independent second modality rather
  than a forced fusion.

## References
1. Belay, A. J., Walle, Y. M., & Haile, M. B. (2024). Deep ensemble learning
   and quantum machine learning approach for Alzheimer's disease detection.
   *Scientific Reports*, 14, 14196.
2. Cappiello, G., & Caruso, F. (2024). Quantum AI for Alzheimer's disease
   early screening. *arXiv:2405.00755*.
3. Mazher, M., Qayyum, A., Khan, M. K. A., Niederer, S., Mokayef, M., &
   Hassan, C. S. (2024). Hybrid classical and quantum deep learning models
   for medical image classification.
4. Kim, R. (2023). Hybrid quantum-classical machine learning for dementia
   detection. *2023 IEEE MIT Undergraduate Research Technology Conference
   (URTC)*.
