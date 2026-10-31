---
title: NLP Sentiment Analysis
subtitle: Word2Vec + LSTM vs. Fine-Tuned DistilBERT
summary: >-
  A sentiment analysis project on IMDb movie reviews comparing a Word2Vec +
  LSTM pipeline with a fine-tuned DistilBERT Transformer. The project covers
  text preprocessing with spaCy, custom Word2Vec training on movie reviews and
  Wikipedia text, model training and evaluation, and a data-order experiment
  across both models.
type: Natural Language Processing Project
categories: [ai-ml]
technologies: [Python, spaCy, Gensim (Word2Vec), TensorFlow / Keras, Hugging Face Transformers, DistilBERT, scikit-learn]

order: 4

links:
  github: https://github.com/shahar-eliyahu/NLP-Final-Project

# Explorer gallery. Media: src/assets/projects_media/nlp-sentiment/images/
# Landscape result charts, shown whole (`fit: contain`).
cover:
  src: f1_summary_cover.png
  alt: "Horizontal bar chart of average test set F1 score: DistilBERT 0.907 (range 0.897 to 0.911) and Word2Vec + LSTM 0.736 (range 0.717 to 0.752)"
  fit: contain
gallery:
  - src: f1_comparison.png
    alt: "Grouped bar chart of test set F1 scores for Word2Vec + LSTM and DistilBERT for the original, shuffled and reversed data orders"
    fit: contain
  - src: confusion_matrices_distilbert.png
    alt: "Three confusion matrices for DistilBERT on 500 positive and 500 negative test reviews, one for each data order: original, shuffled and reversed"
    fit: contain

# Detail page: /projects/nlp-sentiment/. All copy is owner-approved; the results
# match the confusion matrices and the NLP-Final-Project code.
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        This project classifies IMDb movie reviews as positive or negative and compares two approaches to sentiment analysis: a classic pipeline built on custom Word2Vec embeddings and an LSTM network, and a pre-trained DistilBERT Transformer fine-tuned for the task.

        Both models were trained and evaluated on the same balanced sample of reviews, and each was trained three times with the data in a different order: original, shuffled, and reversed.

        Across all six runs, DistilBERT clearly outperformed the LSTM, reaching an average F1 score of 0.907 compared with 0.736.
      media:
        - src: f1_summary_cover.png
          alt: "Horizontal bar chart of average test set F1 score: DistilBERT 0.907 (range 0.897 to 0.911) and Word2Vec + LSTM 0.736 (range 0.717 to 0.752)"
          caption: Average test set F1 score of each model across its three runs, with the range between the lowest and highest result.

    - id: data
      title: Data & Preprocessing
      text: |-
        The project uses the IMDb Movie Reviews dataset, a standard benchmark of 50,000 reviews labeled positive or negative. A balanced sample of 5,000 reviews (2,500 positive and 2,500 negative) was used for training and evaluation, with 20% held out as a test set.

        Reviews were cleaned and processed with spaCy, including tokenization, lemmatization, and part-of-speech tagging.

        To build word embeddings, a custom Word2Vec model was trained on the lemmatized reviews combined with general English text from a Wikipedia corpus. Earlier experiments compared training Word2Vec on reviews only, Wikipedia only, and both combined; the combined source was chosen to balance domain-specific vocabulary with broader language coverage.

        1. IMDb reviews and Wikipedia text
        2. Cleaning, tokenization, lemmatization, and POS tagging with spaCy
        3. Custom Word2Vec embeddings
        4. Word2Vec + LSTM training and DistilBERT fine-tuning
        5. Evaluation with accuracy, F1 score, and confusion matrices

    - id: models
      title: Models
      items:
        - title: Word2Vec + LSTM
          text: |-
            The reviews are converted into sequences and mapped to the custom Word2Vec vectors, which are used as a fixed (non-trainable) embedding layer. An LSTM layer with 128 units and dropout learns from the word sequence, and a sigmoid output layer predicts the sentiment.
        - title: DistilBERT
          text: |-
            DistilBERT (distilbert-base-uncased) is a compact pre-trained Transformer. It was fine-tuned for binary sentiment classification on the same reviews using the Hugging Face Transformers library.

    - id: results
      title: Results
      text: |-
        DistilBERT outperformed the Word2Vec + LSTM model in every run, on both F1 score and accuracy.

        **Test Results**

        | Model | Data Order | Accuracy | F1 Score |
        |---|---|---:|---:|
        | Word2Vec + LSTM | Original | 0.761 | 0.739 |
        | Word2Vec + LSTM | Shuffled | 0.750 | 0.752 |
        | Word2Vec + LSTM | Reversed | 0.724 | 0.717 |
        | DistilBERT | Original | 0.911 | 0.911 |
        | DistilBERT | Shuffled | 0.912 | 0.911 |
        | DistilBERT | Reversed | 0.899 | 0.897 |
      items:
        - title: F1 Score
          media:
            - src: f1_comparison.png
              alt: "Grouped bar chart of test set F1 scores for Word2Vec + LSTM and DistilBERT for the original, shuffled and reversed data orders"
              caption: Test set F1 scores for Word2Vec + LSTM and DistilBERT across the three training data orders. DistilBERT scored between 0.897 and 0.911 in every run, compared with 0.717 to 0.752 for the LSTM.
        - title: Accuracy
          media:
            - src: accuracy_comparison.png
              alt: "Grouped bar chart of test set accuracy for Word2Vec + LSTM and DistilBERT for the original, shuffled and reversed data orders"
              caption: Test set accuracy for both models across the original, shuffled, and reversed data orders. DistilBERT stayed consistently around 90% accuracy, while the LSTM ranged from 72% to 76%.

    - id: errors
      title: Error Analysis
      text: |-
        The confusion matrices show how each model's correct and incorrect predictions are distributed across the 500 positive and 500 negative test reviews.

        The LSTM made considerably more errors, and in the original order most of them were positive reviews classified as negative. DistilBERT's errors were low and roughly balanced between the two classes in all three runs.

        In the data-order experiment, differences within each model were small, and DistilBERT stayed consistently ahead of the LSTM.
      items:
        - title: Word2Vec + LSTM
          media:
            - src: confusion_matrices_lstm.png
              alt: "Three confusion matrices for the Word2Vec + LSTM model on 500 positive and 500 negative test reviews, one for each data order: original, shuffled and reversed"
              caption: Correct and incorrect predictions of the LSTM model on 1,000 test reviews, for each data order. Overall, most errors were positive reviews classified as negative, especially in the original order.
        - title: DistilBERT
          media:
            - src: confusion_matrices_distilbert.png
              alt: "Three confusion matrices for DistilBERT on 500 positive and 500 negative test reviews, one for each data order: original, shuffled and reversed"
              caption: Correct and incorrect predictions of the fine-tuned DistilBERT model on 1,000 test reviews, for each data order. Errors were low in all three data orders and roughly balanced between the two classes.

    - id: technology
      title: Technology & Methodology
      tools:
        - name: Python
          use: Data processing and experiment orchestration.
        - name: spaCy
          use: Tokenization, lemmatization, and part-of-speech tagging.
        - name: Gensim (Word2Vec)
          use: Custom word embeddings.
        - name: TensorFlow / Keras
          use: LSTM model training.
        - name: Hugging Face Transformers
          use: DistilBERT fine-tuning.
        - name: scikit-learn
          use: Data splitting and evaluation metrics.

    - id: findings
      title: Key Findings & Limitations
      items:
        - title: Key Findings
          text: |-
            - The fine-tuned DistilBERT model outperformed the Word2Vec + LSTM pipeline in every run, by about 17 F1 points on average.
            - DistilBERT's results were stable across the three runs, ranging from 0.897 to 0.911 F1.
            - Custom Word2Vec embeddings combining movie reviews with general Wikipedia text gave the LSTM a solid baseline without any pre-trained language model.
        - title: Limitations
          text: |-
            - Training and evaluation used a 5,000-review sample of the full 50,000-review dataset.
            - Each configuration was run once, so small differences between runs may reflect the data split rather than a real effect.
            - The data-order experiment reordered the data before the train/test split, so it does not isolate the effect of training order.

    - id: source-code
      title: Explore the Source Code
      text: |-
        Explore the Python implementation of the complete pipeline, including data loading, spaCy preprocessing, Word2Vec training, the LSTM model, DistilBERT fine-tuning, and evaluation.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/NLP-Final-Project

visual:
  id: nlp
  label: NATURAL LANGUAGE PROCESSING
  kicker: NLP
  headline: Sentiment Analysis
---
