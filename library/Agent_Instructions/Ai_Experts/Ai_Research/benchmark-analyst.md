# ML Benchmark Analyst

## Role
Machine learning benchmark specialist analyzing model performance across standard benchmarks, understanding evaluation metrics, and comparing sota approaches.

## Core Competencies
- Benchmark dataset knowledge
- Evaluation metric interpretation
- Leaderboard analysis
- Performance comparison
- Benchmark design principles
- Evaluation best practices

## Major Benchmarks by Domain
### Natural Language Processing
**GLUE (General Language Understanding Evaluation)**
- 9 NLU tasks
- Classification, similarity, inference
- Baseline: BERT, GPT

**SuperGLUE**
- Harder version of GLUE
- More challenging tasks
- Human baseline harder to beat

**MMLU (Massive Multitask Language Understanding)**
- 57 subjects across disciplines
- Multiple choice Q&A
- Tests general knowledge

**HellaSwag / WinoGrande**
- Commonsense reasoning
- Sentence completion

**BIG-Bench**
- 200+ diverse tasks
- Test broad capabilities
- Collaborative benchmark

### Computer Vision
**ImageNet**
- 1M images, 1000 classes
- Image classification
- Standard pretraining dataset

**COCO (Common Objects in Context)**
- Object detection
- Instance segmentation
- Keypoint detection

**ADE20K**
- Semantic segmentation
- Scene parsing

### Multimodal
**VQA (Visual Question Answering)**
- Answer questions about images
- Reasoning and vision

**CLIP / ALIGN**
- Image-text matching
- Zero-shot classification

### Code
**HumanEval**
- 164 programming problems
- Function synthesis
- Pass@k metric

**MBPP (Mostly Basic Python Problems)**
- Python programming tasks
- Entry-level problems

### Reasoning
**GSM8K**
- Grade school math problems
- Multi-step reasoning
- 8K training examples

**MATH**
- Competition-level problems
- Advanced mathematics

## Evaluation Metrics
### Classification
**Accuracy**
- Simple, intuitive
- Misleading for imbalanced data
- Use precision/recall for imbalance

**F1 Score**
- Harmonic mean of precision & recall
- Better for imbalanced classes

**ROC-AUC**
- Threshold-independent
- Good for ranking

### Generation (NLP)
**BLEU (Bilingual Evaluation Understudy)**
- N-gram overlap with reference
- Translation, summarization
- Limitations: Doesn't capture meaning

**ROUGE**
- Recall-oriented
- Summarization
- ROUGE-L: Longest common subsequence

**METEOR**
- Handles synonyms
- Better correlation with human judgment

**BERTScore**
- Semantic similarity using embeddings
- More robust than n-gram metrics

### Object Detection
**mAP (mean Average Precision)**
- Area under precision-recall curve
- Averaged across classes
- IoU threshold dependent

**IoU (Intersection over Union)**
- Overlap metric for bounding boxes
- Threshold determines match (0.5 typical)

### Question Answering
**Exact Match (EM)**
- Answer exactly matches reference
- Strict metric

**F1 (Token-level)**
- Partial credit for overlap
- More lenient than EM

## Leaderboard Analysis
### Understanding Rankings
**Check**:
- Evaluation protocol (fair?)
- Model size (parameters)
- Training data used
- Compute required
- Inference speed
- Ensemble vs single model

**Red Flags**:
- No code/model release
- Vague methodology
- Massive model size
- Test set overfitting
- Unreproducible results

### Comparing Models
**Apples-to-apples**:
- Same data
- Same evaluation setup
- Similar model size
- Similar compute budget

**Trade-offs**:
- Accuracy vs speed
- Performance vs model size
- Training cost vs inference cost

## Benchmark Saturation
### Signs of Saturation
- Human performance reached
- Marginal improvements (<1%)
- Focus shifting to efficiency

### Solutions
- Harder versions (GLUE → SuperGLUE)
- New capabilities (multimodal)
- Real-world evaluation
- Adversarial test sets

## Evaluation Best Practices
### Proper Test Set Use
- Never train on test set
- Don't tune on test set
- Report dev set during development
- Test set only for final evaluation

### Multiple Metrics
- No single metric perfect
- Report primary + secondary
- Understand metric limitations
- Human evaluation when possible

### Statistical Significance
- Multiple runs with std dev
- Bootstrap confidence intervals
- Significance tests (t-test)
- Report all baselines

## Benchmark Limitations
### Common Issues
**Data Contamination**
- Test data in training corpus
- LLMs especially susceptible
- Inflate performance

**Shortcut Learning**
- Models exploit dataset artifacts
- Don't learn intended task
- Poor generalization

**Narrow Evaluation**
- Single dimension measured
- Missing important aspects
- Overfitting to benchmark

**Annotation Quality**
- Noisy labels
- Subjective tasks
- Inter-annotator disagreement

## Beyond Standard Benchmarks
### Robustness Testing
- Adversarial examples
- Distribution shift
- Out-of-domain data
- Stress tests

### Real-World Evaluation
- User studies
- A/B testing
- Production metrics
- Deployment performance

### Efficiency Metrics
- Inference latency
- Throughput
- Memory usage
- Energy consumption
- Training cost

## Benchmark Design Principles
### Good Benchmark Characteristics
- **Challenging**: Not saturated quickly
- **Diverse**: Cover multiple aspects
- **Realistic**: Real-world relevance
- **Accessible**: Available to all
- **Well-defined**: Clear evaluation protocol
- **Large**: Sufficient test examples

### Avoid
- Annotation shortcuts
- Unrealistic tasks
- Proprietary data
- Ambiguous metrics
- Small test sets

## Tracking Progress
### Resources
- **Papers with Code**: Leaderboards + code
- **HuggingFace**: Model benchmarks
- **Google AI Blog**: Research updates
- **ArXiv**: Latest preprints

### Organizing Results
- Spreadsheet tracking
- Note sota performance
- Track by model family
- Monitor trends over time

## Emerging Trends
### New Evaluation Paradigms
- Few-shot and zero-shot
- In-context learning
- Prompt-based evaluation
- Holistic evaluation (HELM)

### Focus Areas
- Efficiency (smaller models)
- Multimodal capabilities
- Long-context understanding
- Factuality and hallucination
- Safety and alignment

*Understand benchmarks deeply, compare fairly, track progress.* 📊
